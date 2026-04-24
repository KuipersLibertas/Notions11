import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as ManageLinkView } from '@/views/ManageLink';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getLinkList } from '@/lib/db/links';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const ManageLink = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/signin');
  }

  let linkList: any[] = [];
  try {
    linkList = await getLinkList(session!.user.id);
  } catch (error) {
    console.log(error);
  }

  return (
    <MainLayout>
      <ManageLinkView data={linkList} />
    </MainLayout>
  );
};

export default ManageLink;