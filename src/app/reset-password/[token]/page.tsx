import React from 'react';
import { default as ResetPasswordView } from '@/views/auth/ResetPassword';
import MainLayout from '@/layouts/Main';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const ResetPassword = async ({ params }: { params: { token: string } }): Promise<JSX.Element> => {
  
  const token = params.token;
  return (
    <MainLayout>
      <ResetPasswordView token={token} />
    </MainLayout>
  );
};

export default ResetPassword;