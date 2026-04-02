import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as SignUpView } from '@/views/auth/SignUp';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

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