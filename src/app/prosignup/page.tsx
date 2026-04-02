import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as ProSignUpView } from '@/views/ProSignUp';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { AppMode, UserLevel } from '@/utils/constants';

const ProSignUp = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/signin');
  }

  if (session?.user.level > UserLevel.Normal || AppMode.Free) {
    redirect('/');
  }
  
  return (
    <MainLayout>
      <ProSignUpView />
    </MainLayout>
  );
};

export default ProSignUp;