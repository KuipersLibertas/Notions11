'use client';

import React, { useContext } from 'react';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';
import {
  Box,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface IFeature {
  id: number;
  title: string;
}

interface IOption {
  title: string;
  badge?: string;
  highlight?: boolean;
  features: number[];
}

const PricingCompareTable = (): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);
  const isLight = theme.palette.mode === 'light';

  const features: IFeature[] = [
    { id: 1, title: 'Password-protected links' },
    { id: 2, title: 'Custom link slugs' },
    { id: 3, title: 'Expiring links' },
    { id: 4, title: 'Basic analytics' },
    { id: 5, title: 'Advanced analytics + location' },
    { id: 6, title: 'Access email notifications' },
    { id: 7, title: 'Branded download page' },
  ];

  const options: IOption[] = [
    {
      title: 'Notion',
      features: [],
    },
    {
      title: 'Notions11 Free',
      badge: '$0',
      features: [1, 2, 4],
    },
    {
      title: 'Notions11 Pro',
      badge: '$5/mo',
      highlight: true,
      features: [1, 2, 3, 4, 5, 6, 7],
    },
  ];

  return (
    <Box
      id="compare-options"
      sx={{
        backgroundColor: 'alternate.main',
        pt: { xs: '3rem', md: '5rem' },
        pb: { xs: '3rem', md: '5rem' },
      }}
    >
      <Container sx={{ maxWidth: { md: 900 } }}>
        {/* Section header */}
        <Box mb={{ xs: 4, md: 5 }} textAlign="center">
          <Chip
            label="COMPARE"
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
            letterSpacing="-0.025em"
            mb={1.5}
            data-aos="fade"
            data-aos-duration={600}
          >
            Why add Notions11?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: 'auto', lineHeight: 1.65 }}
            data-aos="fade-up"
            data-aos-duration={600}
          >
            Notion is great, but it doesn&apos;t protect your links. Notions11 adds the security and control layer you need.
          </Typography>
        </Box>

        {/* Comparison table */}
        <Box
          data-aos="fade-up"
          data-aos-delay={100}
          data-aos-offset={80}
          data-aos-duration={600}
          sx={{
            borderRadius: 4,
            border: `1.5px solid ${alpha(theme.palette.divider, 0.8)}`,
            overflow: 'hidden',
            boxShadow: `0 8px 32px -8px ${alpha(theme.palette.primary.main, 0.08)}`,
            backgroundColor: 'background.paper',
          }}
        >
          {/* Header row */}
          <Grid
            container
            sx={{
              borderBottom: `1.5px solid ${alpha(theme.palette.divider, 0.8)}`,
              backgroundColor: isLight ? 'alternate.dark' : 'alternate.dark',
            }}
          >
            <Grid item xs={4} sm={4}
              sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}
            >
              <Typography variant="body2" fontWeight={600} color="text.secondary" fontSize="0.78rem" letterSpacing="0.06em" textTransform="uppercase">
                Feature
              </Typography>
            </Grid>
            {options.map((opt, i) => (
              <Grid
                item
                xs={8 / options.length}
                sm={8 / options.length}
                key={i}
                sx={{
                  p: { xs: 1.5, sm: 2, md: 2.5 },
                  textAlign: 'center',
                  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                  ...(opt.highlight && {
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(124,58,237,0.06) 100%)',
                  }),
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  fontSize={{ xs: '0.72rem', sm: '0.85rem' }}
                  color={opt.highlight ? 'primary.main' : 'text.primary'}
                >
                  {opt.title}
                </Typography>
                {opt.badge && (
                  <Chip
                    label={opt.badge}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      height: 18,
                      fontWeight: 700,
                      borderRadius: '99px',
                      ...(opt.highlight
                        ? {
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            color: '#fff',
                          }
                        : {
                            backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                            color: 'text.secondary',
                          }),
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          {/* Feature rows */}
          {features.map((feature, fi) => (
            <Grid
              container
              key={feature.id}
              sx={{
                borderBottom:
                  fi < features.length - 1
                    ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                    : 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
            >
              <Grid
                item
                xs={4}
                sm={4}
                sx={{ p: { xs: 1.5, sm: 2, md: 2.5 }, display: 'flex', alignItems: 'center' }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  fontSize={{ xs: '0.78rem', sm: '0.875rem' }}
                  color="text.primary"
                >
                  {feature.title}
                </Typography>
              </Grid>
              {options.map((opt, oi) => (
                <Grid
                  item
                  xs={8 / options.length}
                  sm={8 / options.length}
                  key={oi}
                  sx={{
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    ...(opt.highlight && {
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(124,58,237,0.04) 100%)',
                    }),
                  }}
                >
                  {opt.features.includes(feature.id) ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: { xs: 18, sm: 20 },
                        color: opt.highlight ? 'primary.main' : '#10b981',
                      }}
                    />
                  ) : (
                    <CancelIcon
                      sx={{
                        fontSize: { xs: 16, sm: 18 },
                        color: alpha(theme.palette.text.secondary, 0.3),
                      }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>

        {!authenticated && (
          <Box
            mt={4}
            textAlign="center"
            data-aos="fade"
            data-aos-duration={600}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Ready to supercharge Notion?</strong>&nbsp;
              Sign up for free — no credit card required.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PricingCompareTable;
