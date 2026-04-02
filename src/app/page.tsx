import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as HomeView } from '@/views/Home';

const Home = (): JSX.Element => {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
};

export default Home;