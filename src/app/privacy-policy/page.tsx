import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as PrivacyPolicyView } from '@/views/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Notions11 Privacy Policy to understand how we collect, use, and protect your personal data when you use our Notion link protection service.',
  alternates: { canonical: 'https://www.notions11.com/privacy-policy' },
  openGraph: {
    url: 'https://www.notions11.com/privacy-policy',
    title: 'Privacy Policy — Notions11',
  },
};

const PrivacyPolicy = (): JSX.Element => {
  return (
    <MainLayout>
      <PrivacyPolicyView />
    </MainLayout>
  );
};

export default PrivacyPolicy;
