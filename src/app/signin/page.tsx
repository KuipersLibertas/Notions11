import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as SignInView } from '@/views/auth/SignIn';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Notions11 account to manage your password-protected Notion links.',
  robots: { index: false, follow: false },
};

const SignIn = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect('/');
  }

  return (
    <MainLayout>
      <SignInView />
    </MainLayout>
  );
};

export default SignIn;
