import { supabase } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

const STRIPE_PRICE_ID = 'price_1M5QUkE4EcK5n9JaGcmiQB4F';
const SITE_URL = process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL ?? 'https://notions11.com';

export async function getSubscription(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('stripe_id')
    .eq('id', userId)
    .single();

  if (!user?.stripe_id) {
    return { success: false as const, message: 'No active subscription found' };
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripe_id,
    return_url: `${SITE_URL}/manage-subscription`,
  });

  return { success: true as const, url: portalSession.url };
}

export async function upgradePro(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('stripe_id')
    .eq('id', userId)
    .single();

  const checkoutParams: Record<string, any> = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${SITE_URL}/user/upgrade-pro/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/prosignup`,
    subscription_data: {
      trial_period_days: 15,
      metadata: { user_id: String(userId) },
    },
    metadata: { user_id: String(userId) },
  };

  if (user?.stripe_id) {
    checkoutParams.customer = user.stripe_id;
  }

  const session = await stripe.checkout.sessions.create(checkoutParams as any);
  return { success: true as const, url: session.url };
}

export async function cancelPro(userId: number) {
  await supabase
    .from('users')
    .update({ is_pro: 0, stripe_id: null, subscription_id: null })
    .eq('id', userId);

  // Clear pro-only features from all user links
  await supabase
    .from('file_list_user')
    .update({ email_notify: false, track_ip: false, is_paid: null, expires_on: null, expire_count: 0 })
    .eq('user_id', userId);

  return { success: true as const };
}

export async function uploadLogo(userId: number, fileBuffer: Buffer, mimeType: string) {
  const ext = mimeType.split('/')[1] ?? 'png';
  const storagePath = `${userId}/logo.${ext}`;

  const { error } = await supabase.storage
    .from('logos')
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

  if (error) return { success: false as const, message: error.message };

  const { data: urlData } = supabase.storage.from('logos').getPublicUrl(storagePath);
  const publicUrl = urlData.publicUrl;

  await supabase.from('users').update({ logo: publicUrl }).eq('id', userId);

  return { success: true as const, file: publicUrl };
}

export async function deleteLogo(userId: number) {
  const { data: user } = await supabase
    .from('users')
    .select('logo')
    .eq('id', userId)
    .single();

  if (user?.logo) {
    // Extract storage path from public URL
    const match = user.logo.match(/logos\/(.+)$/);
    if (match) {
      await supabase.storage.from('logos').remove([match[1]]);
    }
  }

  await supabase.from('users').update({ logo: null }).eq('id', userId);
  return { success: true as const };
}

export async function activatePro(userId: number, stripeId: string, subscriptionId: string) {
  await supabase
    .from('users')
    .update({ is_pro: 1, stripe_id: stripeId, subscription_id: subscriptionId })
    .eq('id', userId);

  await supabase.from('paid_membership').insert({
    user_id: userId,
    type: 2,
    amount: 5,
    status: 1,
  });
}

export async function deactivatePro(stripeCustomerId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_id', stripeCustomerId)
    .maybeSingle();

  if (!user) return;

  await supabase
    .from('users')
    .update({ is_pro: 0, stripe_id: null, subscription_id: null })
    .eq('id', user.id);

  await supabase
    .from('file_list_user')
    .update({ email_notify: false, track_ip: false, is_paid: null, expires_on: null, expire_count: 0 })
    .eq('user_id', user.id);
}
