import React from 'react';
import Container from '@/components/Container';

import {
  Box,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material';

type HelpLayoutProps = {
  title: string,
  description?: string,
  children: React.ReactNode,
}
const HelpLayout = ({ title, children }: HelpLayoutProps): JSX.Element => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: 'calc(100vh - 207px)' }}>
      <Box
        position="relative"
        sx={{
          backgroundColor: 'primary.main',
        }}        
      >
        <Container sx={{ pb: { xs: '2.5rem', md: '5rem' } }}>
          <Typography
            fontWeight={700}
            variant="h4"
            color="common.white"
            display="inline-block"
            maxWidth="50rem"
          >
            {title}
          </Typography>
        </Container>
        <Box
          component="svg"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            width: '100%',
            marginBottom: theme.spacing(-1),
          }}
        >
          <path
            fill={theme.palette.background.paper}
            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
          ></path>
        </Box>
      </Box>
      <Container pt={{ xs: '1rem', sm: '1rem', md: '1rem' }}>
        <Box
          sx={{
            maxWidth: '1236px',
            'p, h2, h3, ol, ul, li': {
              mb: '10px'
            },
            'ol, ul': {
              pl: '30px'
            },
            'a': {
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 500,

              ':hover': {
                textDecoration: 'underline',
              },
            }
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default HelpLayout;