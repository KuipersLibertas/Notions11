import React from 'react';
import Container from '@/components/Container';

import {
  Box,
  Typography
} from '@mui/material';
import { useTheme, alpha } from '@mui/material';
import { ThemeMode } from '@/utils/constants';

type CommonLayoutProps = {
  title: string,
  description?: string,
  children: React.ReactNode,
}
const CommonLayout = ({ title, description, children }: CommonLayoutProps): JSX.Element => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: 'calc(100vh - 207px)' }}>
      <Box
        position="relative"
        sx={{
          backgroundColor: 'alternate.main',
        }}        
      >
        <Container sx={{ pb: { xs: '2.5rem', md: '5rem' } }}>
          <Typography
            fontWeight={700}
            variant="h4"
            color={theme.palette.mode === ThemeMode.light ? 'primary.main' : 'common.white'}
            display="inline-block"
            maxWidth="50rem"
            sx={{
              background: `linear-gradient(180deg, transparent 82%, ${alpha(
                theme.palette.mode === ThemeMode.light ? theme.palette.primary.main : theme.palette.common.white,
                0.3,
              )} 0%)`,
            }}
          >
            {title}
          </Typography>
          {description&&
            <Typography
              fontWeight={300}
              variant="h6"
              marginTop="0.875rem"
              color="text.secondary"
            >
              {description}
            </Typography>
          }
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
      <Box position="relative">
        <Container
          pt={{ xs: '1rem', sm: '1rem', md: '1rem' }}
          
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default CommonLayout;