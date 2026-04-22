import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { encode } from 'next-auth/jwt';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserById } from '@/lib/db/auth';
import { syncSubscription } from '@/lib/db/user';

// Server-side session refresh. Reads the latest user row from Supabase,
// encodes a fresh NextAuth JWT, writes it as a cookie, then redirects.
//
// Query params:
//   sync=1         call syncSubscription() to reconcile Stripe status first
//   callbackUrl    where to redirect after refreshing (default: /user/plan)
//
// Used by:
//   - upgrade-pro success route (?callbackUrl=/user/plan)
//   - Stripe portal return_url  (?sync=1&callbackUrl=/user/plan)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const userId = session.user.id as number;
  const { searchParams } = new URL(request.url);
  const sync        = searchParams.get('sync')        === '1';
  const callbackUrl = searchParams.get('callbackUrl') ?? '/user/plan';
  const target      = new URL(callbackUrl, request.url);

  let freshUser = null;
  try {
    freshUser = sync
      ? await syncSubscription(userId)
      : await getUserById(userId);
  } catch (err: any) {
    console.error('session-refresh error:', err.message);
    try { freshUser = await getUserById(userId); } catch {}
  }

  if (!freshUser) {
    return NextResponse.redirect(target);
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET ?? '';
  const newToken = {
    user:      { ...freshUser, auth_token: '' },
    sign_out:  false,
  };

  const encoded = await encode({ token: newToken, secret, maxAge: 30 * 24 * 60 * 60 });

  // NextAuth uses __Secure- prefix on HTTPS (production)
  const secure     = process.env.NEXTAUTH_URL?.startsWith('https://') ?? process.env.NODE_ENV === 'production';
  const cookieName = secure ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  const response = NextResponse.redirect(target);
  response.cookies.set(cookieName, encoded, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
