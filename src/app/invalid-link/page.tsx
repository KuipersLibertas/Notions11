import MainLayout from '@/layouts/Main';
import React from 'react';
import { default as InvalidLinkView } from '@/views/InvalidLink';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};


const InvalidLink = (): JSX.Element => {
  return (
    <MainLayout mode={2}>
      <InvalidLinkView />
    </MainLayout>
  );
};

export default InvalidLink;