'use client';

import React, { useState, useCallback } from 'react';
import ValidationCheckForm from '@/views/Download/blocks/ValidationCheckForm';
import SharedFiles from '@/views/Download/blocks/SharedFiles';
import Footer from '@/layouts/Main/Footer';
import { Box, Typography, Link } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { LockOutlined } from '@mui/icons-material';
import { IServerLinkDetail } from '@/types';
import { Images } from '@/utils/assets';

const Download = ({ linkInfo }: { linkInfo: IServerLinkDetail }): JSX.Element => {
  const theme = useTheme();
  const [isValidated, setIsValidated] = useState<boolean>(linkInfo.ignoreValidate);
  const isLight = theme.palette.mode === 'light';

  const handleValidationResult = useCallback((result: boolean): void => {
    setIsValidated(result);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: isLight
          ? 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 40%, #f5f0ff 100%)'
          : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{ position: 'fixed', top: '-5%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isLight ? 0.08 : 0.1)} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '5%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isLight ? 0.06 : 0.08)} 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* Top bar — logo only */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
          px: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link href="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={Images.MainLogo}
            alt="Notions11"
            sx={{ height: { xs: 52, md: 64 }, width: 'auto', display: 'block' }}
          />
        </Link>
      </Box>

      {/* Main content */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={2}
        py={{ xs: 4, md: 6 }}
        position="relative"
        zIndex={1}
      >
        <Box width="100%" maxWidth={520}>
          {/* Card */}
          <Box
            sx={{
              backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : alpha(theme.palette.background.paper, 0.85),
              border: `1.5px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              boxShadow: `0 20px 60px -12px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 24px -8px rgba(0,0,0,0.06)`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Card header */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              mb={3}
              pb={2.5}
              sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LockOutlined sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.01em">
                  {isValidated ? 'Your Notion link is ready' : 'Password required'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isValidated
                    ? 'Click the link below to open'
                    : 'Enter the password to access this link'}
                </Typography>
              </Box>
            </Box>

            {/* Content: password form or revealed link */}
            {!isValidated && !linkInfo.requirePaid ? (
              <ValidationCheckForm
                linkInfo={linkInfo}
                onValidationResult={handleValidationResult}
              />
            ) : (
              <SharedFiles linkInfo={linkInfo} />
            )}
          </Box>

          {/* Attribution */}
          <Box textAlign="center" mt={3}>
            <Typography variant="caption" color="text.secondary">
              Secured by{' '}
              <Link
                href="/"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Notions11
              </Link>
              {' '}— password-protect your Notion links for free
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box position="relative" zIndex={1}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Download;
