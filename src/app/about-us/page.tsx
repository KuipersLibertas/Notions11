import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as AboutUsView } from '@/views/AboutUs';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn how Notions11 was founded by Robin Kuipers in 2023. Built on the success of Passdropit — securing over 150,000 links for 35,000+ users — Notions11 brings password-protection to Notion links.',
  alternates: { canonical: 'https://www.notions11.com/about-us' },
  openGraph: {
    url: 'https://www.notions11.com/about-us',
    title: 'About Us — Notions11',
    description:
      'Learn how Notions11 was founded by Robin Kuipers in 2023, bringing password-protected sharing to Notion links.',
  },
};

const AboutUs = (): JSX.Element => {
  return (
    <MainLayout>
      <AboutUsView />
    </MainLayout>
  );
};

export default AboutUs;
