import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as UserEarningReportView } from '@/views/admin/UserEarningReport';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { IUser } from '@/types';
import { getUserList } from '@/lib/db/admin';
import { UserLevel } from '@/utils/constants';

const UserEarningReport = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);
  
  if (session === null) {
    redirect('/signin');
  }

  if (session?.user.level != UserLevel.Admin) {
    redirect('/');
  }

  let userList: IUser[] = [];
  try {
    userList = await getUserList() as IUser[];
  } catch (error: any) {
    console.log(error.message);
  }

  return (
    <MainLayout>
      <UserEarningReportView userList={userList} />
    </MainLayout>
  );
};

export default UserEarningReport;