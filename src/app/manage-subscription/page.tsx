import React from 'react';
import MainLayout from '@/layouts/Main';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { default as ManageSubScriptionView } from '@/views/ManageSubScription';
import { redirect } from 'next/navigation';
import { getSubscription } from '@/lib/db/user';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const ManageSubScription = async () => {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect('/signin');
  }

  let url = '';
  try {
    const response = await getSubscription(session!.user.id);
    if (response.success) url = response.url;
  } catch (error) {
    console.log(error);
  }
  
  return (
    <MainLayout>
      <ManageSubScriptionView url={url} />
    </MainLayout>
  );
};

export default ManageSubScription;