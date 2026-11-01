import { NextResponse } from 'next/server';
import { register } from '@/lib/db/auth';

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, captchaToken } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!captchaToken) {
      return NextResponse.json({ success: false, message: 'Please complete the captcha' }, { status: 400 });
    }

    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return NextResponse.json({ success: false, message: 'Captcha verification failed. Please try again.' }, { status: 400 });
    }

    const result = await register(firstName, lastName, email, password);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
