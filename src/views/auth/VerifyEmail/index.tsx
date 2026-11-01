'use client';

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import { CheckCircleOutline as CheckIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import Link from 'next/link';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail = ({ token }: { token: string }): JSX.Element => {
  const theme = useTheme();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const isLight = theme.palette.mode === 'light';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.message ?? 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [token]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 68px)"
      sx={{
        background: isLight
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.secondary.light, 0.06)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      }}
    >
      <Paper
        elevation={isLight ? 2 : 4}
        sx={{
          p: 5,
          maxWidth: 440,
          width: '100%',
          mx: 2,
          borderRadius: 3,
          textAlign: 'center',
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600}>Verifying your email…</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>Email verified!</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Your account is now active. You can sign in.
            </Typography>
            <Button component={Link} href="/signin" variant="contained" size="large" fullWidth sx={{ py: 1.4 }}>
              Sign in
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>Verification failed</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              {message}
            </Typography>
            <Button component={Link} href="/signup" variant="outlined" size="large" fullWidth sx={{ py: 1.4 }}>
              Back to sign up
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
