import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';

type UserRow = {
  id: number;
  user_name: string;
  user_email: string;
  password_hash: string;
  is_pro: number;
  stripe_id: string | null;
  subscription_id: string | null;
  paypal_id: string | null;
  balance: number;
  logo: string | null;
};

export function formatUser(user: UserRow) {
  return {
    id: user.id,
    user_name: user.user_name,
    user_email: user.user_email,
    level: user.is_pro,
    balance: user.balance ?? 0,
    stripe_id: user.stripe_id ?? '',
    paypal_id: user.paypal_id ?? '',
    subscription_id: user.subscription_id ?? '',
    logo: user.logo ?? '',
  };
}

export async function login(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_email', email.toLowerCase().trim())
    .single();

  if (error || !user) {
    return { success: false as const, message: 'User not found' };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { success: false as const, message: 'Invalid password' };
  }

  return { success: true as const, user: formatUser(user) };
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const normalizedEmail = email.toLowerCase().trim();
  const userName = `${firstName.trim()} ${lastName.trim()}`;

  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('user_email', normalizedEmail)
    .maybeSingle();

  if (existingEmail) {
    return { success: false as const, message: 'Email already in use' };
  }

  const { data: existingName } = await supabase
    .from('users')
    .select('id')
    .eq('user_name', userName)
    .maybeSingle();

  if (existingName) {
    return { success: false as const, message: 'Username already taken' };
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ user_name: userName, user_email: normalizedEmail, password_hash, is_pro: 0, balance: 0 })
    .select()
    .single();

  if (error || !newUser) {
    return { success: false as const, message: 'Registration failed' };
  }

  return { success: true as const, user: formatUser(newUser) };
}

export async function forgotPassword(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const { data: user } = await supabase
    .from('users')
    .select('id, user_name, user_email')
    .eq('user_email', normalizedEmail)
    .maybeSingle();

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true as const, message: 'If that email exists, a reset link has been sent' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await supabase.from('password_reset_tokens').delete().eq('user_id', user.id);
  await supabase.from('password_reset_tokens').insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  const siteUrl = process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL ?? 'https://notions11.com';
  const resetUrl = `${siteUrl}/reset-password/${encodeURIComponent(token)}`;
  await sendPasswordResetEmail(user.user_email, user.user_name, resetUrl);

  return { success: true as const, message: 'Reset email sent' };
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex');

  const { data: tokenRow } = await supabase
    .from('password_reset_tokens')
    .select('id, user_id, expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (!tokenRow) {
    return { success: false as const, message: 'Invalid or expired token' };
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return { success: false as const, message: 'Token has expired' };
  }

  const password_hash = await bcrypt.hash(newPassword, 10);
  await supabase.from('users').update({ password_hash }).eq('id', tokenRow.user_id);
  await supabase.from('password_reset_tokens').delete().eq('id', tokenRow.id);

  return { success: true as const, message: 'Password updated successfully' };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const { data: user } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', userId)
    .single();

  if (!user) return { success: false as const, message: 'User not found' };

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return { success: false as const, message: 'Current password is incorrect' };

  const password_hash = await bcrypt.hash(newPassword, 10);
  await supabase.from('users').update({ password_hash }).eq('id', userId);

  return { success: true as const };
}

export async function getUserById(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) return null;
  return formatUser(user);
}
