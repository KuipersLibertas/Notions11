'use client';

import React, { useState } from 'react';
import Container from '@/components/Container';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { alpha, useTheme } from '@mui/material/styles';
import {
  TimerOutlined,
  BarChartOutlined,
  BrushOutlined,
  NotificationsActiveOutlined,
  CheckCircle as CheckCircleIcon,
  ArrowForward,
} from '@mui/icons-material';
import { CustomToastOptions, PaymentMode, PricePlan } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const FEATURES = [
  {
    title: 'Expiring Links',
    description: 'Set links to expire by date, by download count, or both. Full control on every link.',
    icon: TimerOutlined,
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
  },
  {
    title: 'Advanced Analytics',
    description: 'Detailed access reports with unique users, geographic location, and access timestamps.',
    icon: BarChartOutlined,
    gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  },
  {
    title: 'Your Branding',
    description: 'Upload your logo and it appears on every download page. Your identity, not ours.',
    icon: BrushOutlined,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  },
  {
    title: 'Access Notifications',
    description: 'Instant email alerts when someone accesses your link — configurable per link.',
    icon: NotificationsActiveOutlined,
    gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  },
];

const ProSignUp = (): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();
  const isLight = theme.palette.mode === 'light';

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMode] = useState<number>(PaymentMode.Stripe);

  const handleProcess = async (): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/gateway/upgrade-pro', {
        method: 'POST',
        body: JSON.stringify({ paymentMode }),
      });
      const json = await response.json();
      if (json.success) {
        if (paymentMode === PaymentMode.Balance) {
          window.location.href = '/api/auth/session-refresh?callbackUrl=/user/plan';
          toast.success('Your account has been upgraded to Pro!', CustomToastOptions);
        } else {
          window.location.href = json.url;
        }
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
    <Box
      sx={{
        minHeight: 'calc(100vh - 68px)',
        background: isLight
          ? 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 50%, #f5f0ff 100%)'
          : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <Box sx={{ position: 'absolute', top: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.07)} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <Container sx={{ maxWidth: { md: 900 }, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 5, md: 7 }}>
          <Chip
            label="PRO PLAN"
            size="small"
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              borderRadius: '99px',
              border: 'none',
            }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            letterSpacing="-0.03em"
            mb={2}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Go Pro with Notions11
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 540, mx: 'auto', lineHeight: 1.65 }}
          >
            Everything in your Free account, plus powerful features for professionals who need more control.
          </Typography>
        </Box>

        {/* Feature cards */}
        <Grid container spacing={3} mb={6}>
          {FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  data-aos-duration={600}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `1.5px solid ${alpha(theme.palette.divider, isLight ? 0.8 : 0.5)}`,
                    backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : alpha(theme.palette.background.paper, 0.6),
                    display: 'flex',
                    gap: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      boxShadow: `0 12px 32px -8px ${alpha(theme.palette.primary.main, 0.12)}`,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      background: item.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} mb={0.5} letterSpacing="-0.01em">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.65}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ mb: 5 }} />

        {/* Pricing CTA */}
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 24px 60px -12px ${alpha(theme.palette.primary.main, 0.45)}`,
          }}
        >
          {/* Ring decoration */}
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', border: '40px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

          <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', mb: 1, letterSpacing: '-0.02em' }}>
            ${PricePlan.Pro} / month
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
            Includes a <strong style={{ color: '#fff' }}>15-day free trial</strong> — no credit card required upfront.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
            {['Cancel anytime', 'Instant access', 'All features included'].map((t) => (
              <Box key={t} display="flex" alignItems="center" gap={0.5}>
                <CheckCircleIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                  {t}
                </Typography>
              </Box>
            ))}
          </Box>
          <LoadingButton
            variant="contained"
            loading={isProcessing}
            onClick={handleProcess}
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: '#fff',
              color: '#1d4ed8',
              fontWeight: 700,
              px: 4,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.92)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2)',
              },
            }}
          >
            Start Free Trial
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  );
};

export default ProSignUp;
