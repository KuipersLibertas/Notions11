import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as PaidLinkEarningView } from '@/views/admin/PaidLinkEarning';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { UserLevel } from '@/utils/constants';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const PaidLinkEarning = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/signin');
  }

  if (session?.user.level != UserLevel.Admin) {
    redirect('/');
  }

  return (
    <MainLayout>
      <PaidLinkEarningView />
    </MainLayout>
  );
};

export default PaidLinkEarning;