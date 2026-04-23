'use client';

import ApplicationContext from '@/contexts/ApplicationContext';
import React, { useCallback, useContext } from 'react';
import { Box, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import SignInForm from '@/views/auth/SignIn/Form';

const SignIn = (): JSX.Element => {
  const theme = useTheme();
  const { setShowForgotPassword } = useContext(ApplicationContext);

  const handleForgotPassword = useCallback((): void => {
    setShowForgotPassword(true);
  }, []);

  const handleLogin = useCallback((): void => {
    location.href = '/';
  }, []);

  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 68px)"
      sx={{
        background: isLight
          ? 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 40%, #f5f0ff 100%)'
          : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        px: 2,
        py: 4,
      }}
    >
      {/* Background blobs */}
      <Box
        sx={{
          position: 'fixed',
          top: '10%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isLight ? 0.08 : 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isLight ? 0.06 : 0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: `1.5px solid ${alpha(theme.palette.divider, isLight ? 0.8 : 0.4)}`,
          boxShadow: isLight
            ? `0 20px 60px -12px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 24px -8px rgba(0,0,0,0.06)`
            : `0 20px 60px -12px rgba(0,0,0,0.4)`,
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <SignInForm
          onShowForgotPassword={handleForgotPassword}
          onCallback={handleLogin}
        />
      </Paper>
    </Box>
  );
};

export default SignIn;
