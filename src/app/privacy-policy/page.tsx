import React from 'react';
import MainLayout from '@/layouts/Main';

import { default as PrivacyPolicyView } from '@/views/PrivacyPolicy';

const PrivacyPolicy = (): JSX.Element => {
  return (
    <MainLayout>
      <PrivacyPolicyView />
    </MainLayout>
  );
};

export default PrivacyPolicy;