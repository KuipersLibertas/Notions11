'use client';

import React from 'react';
import Container from '@/components/Container';

import useMediaQuery from '@mui/material/useMediaQuery';

import {
  Box,
  Button,
  Grid,
  Typography,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Custom404 = (): JSX.Element => {
  const theme = useTheme();

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <Box
      bgcolor={theme.palette.alternate.main}
      position={'relative'}
      minHeight={'calc(100vh - 117px)'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      height={1}
      marginTop={-12}
      paddingTop={12}
    >
      <Container>
        <Grid container>
          <Grid
            item
            container
            alignItems={'center'}
            justifyContent={'center'}
            xs={12}
            md={6}
          >
            <Box>
              <Typography
                variant="h1"
                component={'h1'}
                align={isMdScreen ? 'left' : 'center'}
                sx={{ fontWeight: 700 }}
              >
                404
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                align={isMdScreen ? 'left' : 'center'}
              >
                Oops! Looks like you followed a bad link.
              </Typography>
              <Box
                marginTop={4}
                display={'flex'}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button
                  component={Link}
                  variant="contained"
                  color="primary"
                  size="large"
                  href={'/'}
                >
                  Back home
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Custom404;