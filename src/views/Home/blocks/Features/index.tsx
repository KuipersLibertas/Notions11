'use client';

import React, { useCallback, useContext, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';
import {
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  LinkOutlined,
  BarChartOutlined,
  NotificationsActiveOutlined,
  TimerOutlined,
  BrushOutlined,
  AllInclusiveOutlined,
} from '@mui/icons-material';
import PlanPrice from '@/modals/PlanPrice';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: 'Pro' | 'New!';
}

const Features = (): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);
  const [showPlanPricePopup, setShowPlanPricePopup] = useState<boolean>();

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleShowPopup = useCallback((): void => {
    setShowPlanPricePopup(true);
  }, []);

  const isLight = theme.palette.mode === 'light';

  const items: FeatureItem[] = [
    {
      title: 'Unlimited Links',
      description:
        'Create as many password-protected Notion links as you need. No caps, no limits, no compromises.',
      icon: <AllInclusiveOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    },
    {
      title: 'Custom URLs',
      description:
        'Replace random slugs with memorable links. notions11.com/your-brand looks far more professional.',
      icon: <LinkOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
    },
    {
      title: 'Access Analytics',
      description:
        'See who accessed your links, from where, and how often. Know your audience at a glance.',
      icon: <BarChartOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    },
    {
      title: 'Access Notifications',
      description:
        'Get emailed the moment someone accesses your link. Stay in the loop on a per-link basis.',
      icon: <NotificationsActiveOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
      badge: 'Pro',
    },
    {
      title: 'Expiring Links',
      description:
        'Set links to expire after a date, a number of downloads, or both. You stay in control.',
      icon: <TimerOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
      badge: 'Pro',
    },
    {
      title: 'Your Branding',
      description:
        'Upload your logo and apply your color scheme to the download page. Your brand, front and center.',
      icon: <BrushOutlined sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      badge: 'New!',
    },
  ];

  return (
    <Box
      id="features"
      position="relative"
      sx={{
        backgroundColor: 'background.paper',
        pt: { xs: '3rem', md: '5rem' },
        pb: { xs: '3rem', md: '5rem' },
      }}
    >
      <Container sx={{ maxWidth: { md: 1200 } }}>
        {/* Section header */}
        <Box mb={{ xs: 4, md: 6 }} textAlign="center">
          <Chip
            label="FEATURES"
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
            data-aos="fade"
            data-aos-duration={600}
            sx={{
              letterSpacing: '-0.025em',
              mb: 1.5,
            }}
          >
            Everything you need
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            fontWeight={400}
            sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.65, fontSize: '1rem' }}
            data-aos="fade-up"
            data-aos-duration={600}
          >
            Add passwords, analytics, expiry, and branding to any Notion link — all from one simple dashboard.
          </Typography>
        </Box>

        {/* Feature cards */}
        <Grid container spacing={3}>
          {items.map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                data-aos="fade-up"
                data-aos-delay={i * 80}
                data-aos-offset={80}
                data-aos-duration={600}
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 4,
                  border: `1.5px solid ${alpha(theme.palette.divider, isLight ? 0.8 : 0.5)}`,
                  backgroundColor: isLight
                    ? 'rgba(255,255,255,0.8)'
                    : alpha(theme.palette.background.paper, 0.6),
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: `0 16px 40px -8px ${alpha(theme.palette.primary.main, 0.12)}, 0 4px 12px -4px rgba(0,0,0,0.05)`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    background: item.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    mb: 2.5,
                    boxShadow: `0 6px 16px -4px ${alpha(theme.palette.primary.main, 0.35)}`,
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title + badge */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    fontSize="1rem"
                    letterSpacing="-0.01em"
                  >
                    {item.title}
                  </Typography>
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      component="button"
                      clickable
                      onClick={handleShowPopup}
                      sx={{
                        fontSize: '0.67rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: '99px',
                        ...(item.badge === 'Pro'
                          ? {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }
                          : {
                              backgroundColor: alpha('#059669', 0.1),
                              color: '#059669',
                              border: '1px solid rgba(5,150,105,0.2)',
                            }),
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.7}
                  fontSize="0.875rem"
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {showPlanPricePopup && (
        <PlanPrice
          opened={showPlanPricePopup}
          onClose={() => setShowPlanPricePopup(false)}
        />
      )}
    </Box>
  );
};

export default Features;
