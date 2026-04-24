import React from 'react';
import type { Metadata } from 'next';
import MainLayout from '@/layouts/Main';

import { default as HomeView } from '@/views/Home';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.notions11.com' },
};

const Home = (): JSX.Element => {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
};

export default Home;
