import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as TermsOfServiceView } from '@/views/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Review the Notions11 Terms of Service — the rules and conditions that govern your use of our Notion link protection and sharing platform.',
  alternates: { canonical: 'https://www.notions11.com/terms-of-service' },
  openGraph: {
    url: 'https://www.notions11.com/terms-of-service',
    title: 'Terms of Service — Notions11',
  },
};

const TermsOfService = (): JSX.Element => {
  return (
    <MainLayout>
      <TermsOfServiceView />
    </MainLayout>
  );
};

export default TermsOfService;
