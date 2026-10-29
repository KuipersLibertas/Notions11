import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BREVO_API_KEY ?? '';

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'BREVO_API_KEY is not set' }, { status: 500 });
  }

  // Ping the Brevo account endpoint — read-only, no side effects
  let brevoStatus: number | null = null;
  let brevoBody: unknown = null;
  try {
    const res = await fetch('https://api.brevo.com/v3/account', {
      headers: { 'api-key': apiKey, Accept: 'application/json' },
    });
    brevoStatus = res.status;
    brevoBody = await res.json();
  } catch (err: unknown) {
    return NextResponse.json({
      ok: false,
      keyPresent: true,
      keyLength: apiKey.length,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }

  return NextResponse.json({
    ok: brevoStatus === 200,
    keyPresent: true,
    keyLength: apiKey.length,
    brevoStatus,
    brevoEmail: (brevoBody as Record<string, unknown>)?.email ?? null,
  });
}
