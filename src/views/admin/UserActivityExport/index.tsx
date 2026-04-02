'use client';

import React, {useState} from 'react';
import AdminLayout from '@/views/shared/layouts/AdminLayout';

import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

const UserActivityExport = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleExport = async (): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/gateway/export-activity');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UserDataExport.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
    
  };

  return (
    <AdminLayout>
      <Box mb="2rem">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          User Activity Export
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="center" py="2rem">
        <LoadingButton
          variant="contained"
          color="success"
          sx={{ alignItems: 'center' }}
          loading={isProcessing}
          onClick={handleExport}
        >
          <FileDownloadIcon />
          Export User Data
        </LoadingButton>
      </Box>
    </AdminLayout>
  );
};

export default UserActivityExport;