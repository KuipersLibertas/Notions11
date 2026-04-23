import React from 'react';
import Container from '@/components/Container';
import { Typography, Box, Link, Grid, Divider } from '@mui/material';
import { Images } from '@/utils/assets';

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
      sx={{ color: '#64748b' }}
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
            color: '#475569',
            fontWeight: 500,
            transition: 'color 0.15s',
            '&:hover': { color: '#2563eb' },
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
        borderTop: '1px solid rgba(15,23,42,0.07)',
        backgroundColor: '#ffffff',
      }}
    >
      <Container sx={{ py: { xs: '2.5rem', md: '3.5rem' } }}>
        <Grid container spacing={4}>
          {/* Brand column */}
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <Box
                component="img"
                src={Images.MainLogo}
                alt="Notions11"
                sx={{
                  display: 'block',
                  height: { xs: 36, md: 42 },
                  width: 'auto',
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: '#475569', maxWidth: 240, lineHeight: 1.65 }}
            >
              Password-protect your Notion links and share securely. Analytics, expiry, and branding included.
            </Typography>
            <Box mt={2.5}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
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
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
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
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              All systems operational
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
