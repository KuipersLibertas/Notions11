'use client';

import React from 'react';
import Hero from '@/views/Home/blocks/Hero';
import PricingCompareTable from '@/views/Home/blocks/PricingCompareTable';
import Features from '@/views/Home/blocks/Features';
import Pricing from '@/views/Home/blocks/Pricing';

const Home = (): JSX.Element => {
  return (
    <>
      <Hero />
      <PricingCompareTable />
      <Features />
      <Pricing />
    </>
  );
};

export default Home;