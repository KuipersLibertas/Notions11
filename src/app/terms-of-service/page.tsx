import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as TermsOfServiceView } from '@/views/TermsOfService';

const TermsOfService = (): JSX.Element => {
  return (
    <MainLayout>
      <TermsOfServiceView />
    </MainLayout>
  );
};

export default TermsOfService;