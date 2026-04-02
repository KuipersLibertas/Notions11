import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as LinkReportView } from '@/views/admin/LinkReport';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { UserLevel } from '@/utils/constants';

const LinkReport = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    redirect('/signin');
  }

  if (session?.user.level != UserLevel.Admin) {
    redirect('/');
  }

  return (
    <MainLayout>
      <LinkReportView />
    </MainLayout>
  );
};

export default LinkReport;
