import MainLayout from '@/layouts/Main';
import React from 'react';
import { default as Custom404View } from '@/views/Custom404';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

const NotFound = (): JSX.Element => {
  return (
    <MainLayout>
      <Custom404View />
    </MainLayout>
  );
};

export default NotFound;
