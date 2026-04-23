'use client';

import React, { useState } from 'react';
import Container from '@/components/Container';
import { Box, Typography, Button, Link, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { IChooseLink } from '@/types';
import EnterLink from '@/views/CreateNewLink/blocks/EnterLink';
import GenerateUrlPwd from '@/views/CreateNewLink/blocks/GenerateUrlPwd';
import ChooseResult from '@/views/CreateNewLink/blocks/ChooseResult';
import { LockOutlined, ArrowForward, AutoAwesome } from '@mui/icons-material';

const Hero = (): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();

  const [step, setStep] = useState<number>(1);
  const [chooseLink, setChooseLink] = useState<IChooseLink>();

  const handleEnteredLink = (chooseLink: IChooseLink) => {
    if (!session?.user) {
      setChooseLink(chooseLink);
      setStep(2);
    }
  };

  const handleSave = (): void => {
    setStep(3);
  };

  const isLight = theme.palette.mode === 'light';

  return (
    <Box
      position="relative"
      overflow="hidden"
      sx={{
        minHeight: { xs: 'auto', md: 'calc(100vh - 68px)' },
        display: 'flex',
        alignItems: 'center',
        background: isLight
          ? 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 40%, #f5f0ff 100%)'
          : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: 300, md: 600 },
          height: { xs: 300, md: 600 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isLight ? 0.1 : 0.12)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '-8%',
          width: { xs: 200, md: 500 },
          height: { xs: 200, md: 500 },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isLight ? 0.08 : 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box width={1} py={{ xs: '3.5rem', md: '5rem' }}>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box maxWidth={{ xs: 1, md: 760 }} width={1}>
            {/* Badge */}
            <Box display="flex" justifyContent="center" mb={3} data-aos="fade-down" data-aos-duration={500}>
              <Chip
                icon={<AutoAwesome sx={{ fontSize: '0.9rem !important', color: 'primary.main' }} />}
                label="Password-protect any Notion link instantly"
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  borderRadius: '99px',
                  px: 0.5,
                  py: 2.5,
                  height: 'auto',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            </Box>

            {/* Headline */}
            <Typography
              variant="h1"
              textAlign="center"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.75rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                mb: 2.5,
              }}
              data-aos="fade-up"
              data-aos-duration={600}
            >
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Secure your Notion
              </Box>
              <br />
              links in seconds
            </Typography>

            {/* Subheading */}
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
                maxWidth: 540,
                mx: 'auto',
                mb: 4,
              }}
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={100}
            >
              Add password protection, custom URLs, expiry limits, and analytics to any Notion page — no coding required.
            </Typography>

            {/* CTA widget */}
            {!session?.user && (
              <Box
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={200}
              >
                <Box
                  sx={{
                    backgroundColor: isLight
                      ? 'rgba(255,255,255,0.9)'
                      : alpha(theme.palette.background.paper, 0.7),
                    border: `1.5px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                    borderRadius: 4,
                    p: { xs: 2.5, md: 3.5 },
                    boxShadow: `0 20px 60px -12px ${alpha(theme.palette.primary.main, 0.15)}, 0 8px 24px -8px rgba(0,0,0,0.08)`,
                    backdropFilter: 'blur(12px)',
                    mb: 3,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={2}
                  >
                    <LockOutlined
                      fontSize="small"
                      sx={{ color: 'primary.main', opacity: 0.8 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Try it free — no account needed
                    </Typography>
                  </Box>

                  {step === 1 && <EnterLink onEntered={handleEnteredLink} />}
                  {chooseLink && step === 2 && (
                    <GenerateUrlPwd linkInfo={chooseLink} onSave={handleSave} />
                  )}
                  {chooseLink && step === 3 && <ChooseResult linkInfo={chooseLink} />}
                </Box>

                <Box display="flex" justifyContent="center" alignItems="center" gap={0.75}>
                  <Typography variant="body2" color="text.secondary">
                    Want full control?
                  </Typography>
                  <Link
                    href="/signup"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Create a free account <ArrowForward sx={{ fontSize: '0.9rem' }} />
                  </Link>
                </Box>
              </Box>
            )}

            {/* Logged-in CTAs */}
            {session?.user && (
              <Box
                display="flex"
                justifyContent="center"
                gap={2}
                flexWrap="wrap"
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={200}
              >
                <Button
                  variant="contained"
                  href="/create-new-link"
                  component="a"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  Create a New Link
                </Button>
                <Button
                  variant="outlined"
                  href="/manage-link"
                  component="a"
                  size="large"
                  sx={{ borderColor: alpha(theme.palette.primary.main, 0.4) }}
                >
                  Manage My Links
                </Button>
              </Box>
            )}

            {/* Social proof */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              mt={4}
              flexWrap="wrap"
              data-aos="fade"
              data-aos-duration={600}
              data-aos-delay={300}
            >
              {[
                { stat: 'Free', label: 'to start' },
                { stat: '∞', label: 'Unlimited links' },
                { stat: '15s', label: 'Setup time' },
              ].map((item, i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{ color: 'text.secondary' }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize="0.95rem"
                    color="primary.main"
                  >
                    {item.stat}
                  </Typography>
                  <Typography fontSize="0.8rem" color="text.secondary">
                    {item.label}
                  </Typography>
                  {i < 2 && (
                    <Box
                      sx={{
                        width: 3,
                        height: 3,
                        borderRadius: '50%',
                        backgroundColor: 'text.secondary',
                        opacity: 0.35,
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Wave separator */}
      <Box
        position="absolute"
        bottom={0}
        component="svg"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 80"
        sx={{
          width: '100%',
          height: { xs: 40, md: 80 },
          display: 'block',
        }}
      >
        <path
          fill={theme.palette.background.paper}
          d="M0,40 C480,80 1440,0 1920,40 L1920,80 L0,80 Z"
        />
      </Box>
    </Box>
  );
};

export default Hero;
