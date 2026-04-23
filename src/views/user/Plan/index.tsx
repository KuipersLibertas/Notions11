'use client';

import React, { useState } from 'react';
import UserLayout from '@/views/shared/layouts/UserLayout';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { alpha, useTheme } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  WorkspacePremium as CrownIcon,
} from '@mui/icons-material';
import { PricePlan, UserLevel, CustomToastOptions, AppMode, PaymentMode } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import Confirm from '@/modals/Confirm';

const FREE_FEATURES = [
  'Unlimited password-protected links',
  'Custom link slugs',
  'Edit and manage your links',
  'Basic access analytics',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Advanced analytics + location data',
  'Email notifications on each access',
  'Set expiring links (date or count)',
  'Your logo on download pages',
];

const FeatureRow = ({ text, color }: { text: string; color?: string }): JSX.Element => (
  <Box display="flex" alignItems="flex-start" gap={1.25} mb={1.25}>
    <CheckCircleIcon
      sx={{ fontSize: 17, mt: 0.25, flexShrink: 0, color: color || 'primary.main' }}
    />
    <Typography variant="body2" fontWeight={500} lineHeight={1.5} color="text.primary">
      {text}
    </Typography>
  </Box>
);

const Plan = (): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMode] = useState<number>(PaymentMode.Stripe);
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

  const isPro = !!(session?.user.level && session.user.level >= UserLevel.Pro);

  const handleCancel = async (): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/gateway/user-subscription');
      const json = await response.json();
      if (json.success && json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.message || 'Could not open subscription portal', CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (): Promise<void> => {
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
    <UserLayout>
      {/* Header */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
            Your Plan
          </Typography>
          {isPro && (
            <Chip
              icon={<CrownIcon sx={{ fontSize: '0.9rem !important' }} />}
              label="Pro"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: 'none',
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {isPro
            ? 'You are on the Pro plan. Manage or cancel your subscription below.'
            : 'You are on the Free plan. Upgrade to Pro for advanced features.'}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Plan cards */}
      <Grid container spacing={3}>
        {/* Free plan */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: `1.5px solid ${
                !isPro
                  ? theme.palette.primary.main
                  : alpha(theme.palette.divider, 0.8)
              }`,
              backgroundColor: !isPro
                ? alpha(theme.palette.primary.main, 0.03)
                : 'transparent',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {!isPro && (
              <Chip
                label="Current Plan"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  height: 22,
                  borderRadius: '99px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              />
            )}
            <Typography variant="overline" fontWeight={700} color="text.secondary" letterSpacing="0.08em" display="block" mb={0.5}>
              Free
            </Typography>
            <Box display="flex" alignItems="baseline" gap={0.5} mb={2}>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">/month</Typography>
            </Box>
            <Box flex={1}>
              {FREE_FEATURES.map((f, i) => <FeatureRow key={i} text={f} />)}
            </Box>
          </Box>
        </Grid>

        {/* Pro plan */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: `1.5px solid ${
                isPro
                  ? theme.palette.primary.main
                  : alpha(theme.palette.divider, 0.8)
              }`,
              background: isPro
                ? 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(124,58,237,0.05) 100%)'
                : 'transparent',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {isPro && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '0.85rem !important' }} />}
                label="Current Plan"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  height: 22,
                  borderRadius: '99px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: '#fff',
                  border: 'none',
                }}
              />
            )}
            <Typography variant="overline" fontWeight={700} color="text.secondary" letterSpacing="0.08em" display="block" mb={0.5}>
              Pro
            </Typography>
            <Box display="flex" alignItems="baseline" gap={0.5} mb={2}>
              <Typography
                variant="h4"
                fontWeight={800}
                letterSpacing="-0.03em"
                sx={isPro ? {
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : {}}
              >
                ${PricePlan.Pro}
              </Typography>
              <Typography variant="body2" color="text.secondary">/month</Typography>
            </Box>
            <Box flex={1}>
              {PRO_FEATURES.map((f, i) => (
                <FeatureRow
                  key={i}
                  text={f}
                  color={isPro ? theme.palette.primary.main : undefined}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* CTA */}
      {!AppMode.Free && (
        <Box mt={4} display="flex" justifyContent={{ xs: 'stretch', sm: 'flex-start' }}>
          <LoadingButton
            variant="contained"
            loading={isProcessing}
            onClick={() => isPro ? setShowConfirmPopup(true) : handleUpgrade()}
            sx={{
              minWidth: 180,
              ...(isPro && {
                background: 'none',
                backgroundColor: 'transparent',
                border: `1.5px solid ${alpha(theme.palette.divider, 0.8)}`,
                color: 'text.primary',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: alpha('#ef4444', 0.05),
                  borderColor: '#fca5a5',
                  color: '#ef4444',
                  transform: 'none',
                  boxShadow: 'none',
                },
              }),
            }}
          >
            {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
          </LoadingButton>
        </Box>
      )}

      {/* Footer note */}
      <Box mt={4} pt={3} sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
        <Typography variant="caption" color="text.secondary">
          Questions? Reach us at&nbsp;
          <Link href="mailto:contact@notions11.com" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
            contact@notions11.com
          </Link>
          &nbsp;or on&nbsp;
          <Link href="https://x.com/Notions_11" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
            Twitter
          </Link>.
        </Typography>
      </Box>

      {showConfirmPopup && (
        <Confirm
          opened={showConfirmPopup}
          onClose={() => setShowConfirmPopup(false)}
          onOk={handleCancel}
          message="You'll be taken to the Stripe portal to manage your subscription.<br />Cancelling there will remove your Pro access at the end of the billing period."
        />
      )}
    </UserLayout>
  );
};

export default Plan;
