import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as AboutUsView } from '@/views/AboutUs';

const AboutUs = (): JSX.Element => {
  return (
    <MainLayout>
      <AboutUsView />
    </MainLayout>
  );
};

export default AboutUs;