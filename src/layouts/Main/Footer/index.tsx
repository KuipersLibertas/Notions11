import React from 'react';
import Container from '@/components/Container';
import { Typography, Box, Link, Grid, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Images } from '@/utils/assets';
import { ThemeMode } from '@/utils/constants';

const footerLinks = {
  product: [
    { title: 'Features', href: '/#features' },
    { title: 'Plans & Pricing', href: '/#plan-and-pricing' },
    { title: 'Create a Link', href: '/create-new-link' },
    { title: 'Manage Links', href: '/manage-link' },
  ],
  company: [
    { title: 'About Us', href: '/about-us' },
    { title: 'Blog', href: '/blog' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Service', href: '/terms-of-service' },
  ],
  social: [
    { title: 'Twitter / X', href: 'https://x.com/Notions_11' },
    { title: 'Contact Us', href: 'mailto:contact@notions11.com' },
  ],
};

const FooterLinkGroup = ({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}): JSX.Element => (
  <Box>
    <Typography
      variant="overline"
      fontWeight={700}
      color="text.secondary"
      letterSpacing="0.08em"
      fontSize="0.7rem"
      display="block"
      mb={2}
    >
      {title}
    </Typography>
    <Box display="flex" flexDirection="column" rowGap={1.25}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          underline="none"
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            fontWeight: 500,
            transition: 'color 0.15s',
            '&:hover': { color: 'primary.main' },
          }}
        >
          {link.title}
        </Link>
      ))}
    </Box>
  </Box>
);

const Footer = (): JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        backgroundColor: 'alternate.dark',
      }}
    >
      <Container sx={{ py: { xs: '2.5rem', md: '3.5rem' } }}>
        <Grid container spacing={4}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <Box
                component="img"
                src={Images.DarkLogo}
                height={32}
                width={130}
                sx={{
                  display: 'block',
                  filter: 'none',
                  '.dark &': { filter: 'invert(1)' },
                }}
                alt="Notions11"
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 240, lineHeight: 1.65 }}
            >
              Password-protect your Notion links and share securely. Analytics, expiry, and branding included.
            </Typography>
            <Box mt={2.5}>
              <Typography variant="caption" color="text.secondary">
                Looking for free file storage?&nbsp;
                <Link
                  href="https://www.filestreams.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Try Filestreams.com
                </Link>
              </Typography>
            </Box>
          </Grid>

          {/* Link groups */}
          <Grid item xs={6} sm={4} md={2.5}>
            <FooterLinkGroup title="Product" links={footerLinks.product} />
          </Grid>
          <Grid item xs={6} sm={4} md={2.5}>
            <FooterLinkGroup title="Company" links={footerLinks.company} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FooterLinkGroup title="Connect" links={footerLinks.social} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'center' }}
          rowGap={1}
        >
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} Notions11. All rights reserved.
          </Typography>
          <Box display="flex" gap={0.5} alignItems="center">
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block',
              }}
            />
            <Typography variant="caption" color="text.secondary">
              All systems operational
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
