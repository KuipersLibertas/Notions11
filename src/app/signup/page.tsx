import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as SignUpView } from '@/views/auth/SignUp';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create a Free Account',
  description:
    'Sign up for Notions11 and start password-protecting your Notion links in seconds — free forever, no credit card required.',
  alternates: { canonical: 'https://www.notions11.com/signup' },
  openGraph: {
    url: 'https://www.notions11.com/signup',
    title: 'Create a Free Account — Notions11',
    description: 'Sign up free and start protecting your Notion links with passwords, expiry, and analytics.',
  },
};

const SignUp = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect('/');
  }

  return (
    <MainLayout>
      <SignUpView />
    </MainLayout>
  );
};

export default SignUp;
