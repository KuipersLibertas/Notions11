import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as PlanView } from '@/views/user/Plan';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const Plan = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/signin');
  }

  return (
    <MainLayout>
      <PlanView />
    </MainLayout>
  );
};

export default Plan;