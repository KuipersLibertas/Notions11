'use client';

import React, { useEffect } from 'react';
import CommonLayout from '@/views/shared/layouts/CommonLayout';

import {
  Box
} from '@mui/material';

const ManageSubScription = ({ url }: { url: string }): JSX.Element => {
  useEffect(() => {
    if (url && url.length > 0) {
      window.location.href = url;
    }
  }, []);
  return (
    <CommonLayout title="Manage Subscription">
      <Box></Box>
    </CommonLayout>
  );
};

export default ManageSubScription;