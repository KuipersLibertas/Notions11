import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as SignInView } from '@/views/auth/SignIn';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

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
