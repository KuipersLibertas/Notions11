import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 });
  }

  const tokenHash = crypto.createHash('sha256').update(decodeURIComponent(token)).digest('hex');

  const { data: tokenRow } = await supabase
    .from('email_verification_tokens')
    .select('id, user_id, expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (!tokenRow) {
    return NextResponse.json({ success: false, message: 'Invalid or expired link' }, { status: 400 });
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    await supabase.from('email_verification_tokens').delete().eq('id', tokenRow.id);
    return NextResponse.json({ success: false, message: 'This link has expired. Please sign up again.' }, { status: 400 });
  }

  await supabase.from('users').update({ email_verified: true }).eq('id', tokenRow.user_id);
  await supabase.from('email_verification_tokens').delete().eq('id', tokenRow.id);

  return NextResponse.json({ success: true });
}
