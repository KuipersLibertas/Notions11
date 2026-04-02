'use client';

import React, { useContext, useState } from 'react';
import ApplicationContext from '@/contexts/ApplicationContext';

import {
  Box,
  Typography,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IFile, IServerLinkDetail } from '@/types';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

const SharedFiles = ({ linkInfo }: { linkInfo: IServerLinkDetail }): JSX.Element => {
  const theme = useTheme();
  const { authenticated, setShowSignIn } = useContext(ApplicationContext);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleBuy = async (): Promise<void> => {
    if (!authenticated) {
      setShowSignIn(true);
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/buy-link',
        {
          method: 'POST',
          body: JSON.stringify({ linkId: linkInfo.id })
        }
      );
      const json = await response.json();
      if (json.success) {
        window.location.reload();
      } else {
        toast.error(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        borderBottom = {`1px solid ${theme.palette.common.gray}`}
        p={1}
        bgcolor="background.level1"
      >
        <Box flex={1}>
          <Typography variant="subtitle2" fontWeight={500} color="text.secondary">Link</Typography>
        </Box>
      </Box>
      {!linkInfo.requirePaid&&
        <Box>
          {linkInfo.files.map((file: IFile, index: number) =>
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottom = {`1px solid ${theme.palette.common.gray}`}
              px={1}
            >
              <Box flex={1}>
                <Link
                  sx={{ textDecoration: 'none' }}
                  href={file.url}
                  target="_blank"
                >
                  {file.url}
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      }
      {linkInfo.requirePaid&&
        <>
          <Box>
            {linkInfo.files.map((file: IFile, index: number) =>
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom = {`1px solid ${theme.palette.common.gray}`}
                px={1}
              >
                <Box flex={1}>
                  <Typography variant="subtitle1" color="primary.main">
                    {file.url.split('?')[1]}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <LoadingButton
              variant="contained"
              color="error"
              loading={isProcessing}
              onClick={handleBuy}
            >
              Buy Now
            </LoadingButton>
          </Box>
        </>
      }
    </Box>
  );
};

export default SharedFiles;