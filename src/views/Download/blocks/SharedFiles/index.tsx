'use client';

import React, { useContext, useState } from 'react';
import ApplicationContext from '@/contexts/ApplicationContext';
import { Box, Typography, Link, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { OpenInNew as OpenInNewIcon, Lock as LockIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { IFile, IServerLinkDetail } from '@/types';
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
      const response = await fetch('/api/gateway/buy-link', {
        method: 'POST',
        body: JSON.stringify({ linkId: linkInfo.id }),
      });
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

  if (linkInfo.requirePaid) {
    return (
      <Box>
        <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
          {linkInfo.files.map((file: IFile, index: number) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <LockIcon sx={{ fontSize: 18, color: 'text.secondary', flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {file.url.split('?')[1] || 'Protected link'}
              </Typography>
            </Box>
          ))}
        </Box>
        <LoadingButton
          variant="contained"
          loading={isProcessing}
          onClick={handleBuy}
          fullWidth
          size="large"
          sx={{ py: 1.4 }}
        >
          Unlock — Buy Now
        </LoadingButton>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {linkInfo.files.map((file: IFile, index: number) => (
        <Button
          key={index}
          component="a"
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          fullWidth
          endIcon={<OpenInNewIcon fontSize="small" />}
          sx={{
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.5,
            borderRadius: 2.5,
            borderWidth: '1.5px',
            textAlign: 'left',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            color: 'primary.main',
            borderColor: alpha(theme.palette.primary.main, 0.35),
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          <Typography
            component="span"
            noWrap
            sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem', fontWeight: 500 }}
          >
            {file.url}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default SharedFiles;
