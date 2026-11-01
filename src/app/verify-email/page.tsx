import React from 'react';
import MainLayout from '@/layouts/Main';
import VerifyEmailView from '@/views/auth/VerifyEmail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Your Email',
  robots: { index: false, follow: false },
};

const VerifyEmailPage = ({ searchParams }: { searchParams: { token?: string } }): JSX.Element => {
  return (
    <MainLayout>
      <VerifyEmailView token={searchParams.token ?? ''} />
    </MainLayout>
  );
};

export default VerifyEmailPage;
