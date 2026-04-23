'use client';

import React, { useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { CheckCircle as CheckCircleIcon, Star as StarIcon } from '@mui/icons-material';
import { PricePlan } from '@/utils/constants';

const FeatureRow = ({
  text,
  highlighted,
}: {
  text: string;
  highlighted?: boolean;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="flex-start" gap={1.25} mb={1.25}>
      <CheckCircleIcon
        sx={{
          fontSize: 18,
          mt: 0.2,
          flexShrink: 0,
          color: highlighted ? '#fff' : theme.palette.primary.main,
        }}
      />
      <Typography
        variant="body2"
        color={highlighted ? 'rgba(255,255,255,0.9)' : 'text.secondary'}
        fontWeight={500}
        lineHeight={1.5}
      >
        {text}
      </Typography>
    </Box>
  );
};

const Pricing = (): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);
  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), { defaultMatches: true });
  const isLight = theme.palette.mode === 'light';

  const freePlan = {
    title: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to get started securing Notion links.',
    cta: 'Get started free',
    ctaHref: '/signup',
    features: [
      'Unlimited password-protected links',
      'Custom link slugs',
      'Edit and manage your links',
      'Basic access analytics',
    ],
    highlighted: false,
  };

  const proPlan = {
    title: 'Pro',
    price: `$${PricePlan.Pro}`,
    period: 'per month',
    description: 'For power users who need advanced analytics, notifications, and branding.',
    cta: 'Start 15-day free trial',
    ctaHref: '/signup',
    features: [
      'Everything in Free',
      'Advanced analytics with location data',
      'Email notifications on every access',
      'Expiring links (by date or count)',
      'Your logo on all download pages',
    ],
    highlighted: true,
    badge: 'Most Popular',
  };

  return (
    <Box
      id="plan-and-pricing"
      sx={{
        backgroundColor: 'alternate.main',
        pt: { xs: '3rem', md: '5rem' },
        pb: { xs: '3.5rem', md: '6rem' },
      }}
    >
      <Container sx={{ maxWidth: { md: 1000 } }}>
        {/* Section header */}
        <Box mb={{ xs: 4, md: 6 }} textAlign="center">
          <Chip
            label="PRICING"
            size="small"
            sx={{
              mb: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              borderRadius: '99px',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            textAlign="center"
            letterSpacing="-0.025em"
            data-aos="fade"
            data-aos-duration={600}
            mb={1.5}
          >
            Simple, transparent pricing
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 480, mx: 'auto', lineHeight: 1.65 }}
            data-aos="fade-up"
            data-aos-duration={600}
          >
            Start free, upgrade when you need more. No hidden fees, no lock-in.
          </Typography>
        </Box>

        {/* Plan cards */}
        <Grid container spacing={3} justifyContent="center">
          {/* Free plan */}
          <Grid item xs={12} md={5}
            data-aos="fade-right"
            data-aos-duration={600}
            data-aos-offset={80}
          >
            <Box
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: `1.5px solid ${alpha(theme.palette.divider, 0.8)}`,
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box mb={3}>
                <Typography variant="overline" fontWeight={700} color="text.secondary" letterSpacing="0.08em">
                  {freePlan.title}
                </Typography>
                <Box display="flex" alignItems="baseline" gap={0.5} mt={1} mb={1}>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    letterSpacing="-0.03em"
                  >
                    {freePlan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    / {freePlan.period}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                  {freePlan.description}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Box flex={1} mb={3}>
                {freePlan.features.map((f, i) => (
                  <FeatureRow key={i} text={f} />
                ))}
              </Box>

              {!authenticated && (
                <Button
                  variant="outlined"
                  href={freePlan.ctaHref}
                  component="a"
                  fullWidth
                  size="large"
                  sx={{
                    borderWidth: '1.5px',
                    '&:hover': { borderWidth: '1.5px' },
                  }}
                >
                  {freePlan.cta}
                </Button>
              )}
            </Box>
          </Grid>

          {/* Pro plan */}
          <Grid item xs={12} md={5}
            data-aos="fade-left"
            data-aos-duration={600}
            data-aos-offset={80}
            data-aos-delay={100}
          >
            <Box
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 24px 60px -12px ${alpha(theme.palette.primary.main, 0.45)}`,
              }}
            >
              {/* Decorative ring */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: '40px solid rgba(255,255,255,0.06)',
                  pointerEvents: 'none',
                }}
              />

              {proPlan.badge && (
                <Box position="absolute" top={20} right={20}>
                  <Chip
                    icon={<StarIcon sx={{ fontSize: '0.85rem !important', color: '#fff !important' }} />}
                    label={proPlan.badge}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '99px',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                </Box>
              )}

              <Box mb={3}>
                <Typography variant="overline" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.7)' }} letterSpacing="0.08em">
                  {proPlan.title}
                </Typography>
                <Box display="flex" alignItems="baseline" gap={0.5} mt={1} mb={1}>
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    letterSpacing="-0.03em"
                    sx={{ color: '#fff' }}
                  >
                    {proPlan.price}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} fontWeight={500}>
                    / {proPlan.period}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }} lineHeight={1.6}>
                  {proPlan.description}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mb: 2.5 }} />

              <Box flex={1} mb={3}>
                {proPlan.features.map((f, i) => (
                  <FeatureRow key={i} text={f} highlighted />
                ))}
              </Box>

              {!authenticated && (
                <Button
                  variant="contained"
                  href={proPlan.ctaHref}
                  component="a"
                  fullWidth
                  size="large"
                  sx={{
                    backgroundColor: '#fff',
                    color: theme.palette.primary.dark,
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 20px -4px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {proPlan.cta}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Footer note */}
        <Box
          mt={4}
          textAlign="center"
          data-aos="fade"
          data-aos-duration={600}
        >
          <Typography variant="body2" color="text.secondary">
            You can also use Notions11 <strong>without any account</strong> — create unlimited links with basic features, though you won&apos;t be able to edit or delete them later.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;
