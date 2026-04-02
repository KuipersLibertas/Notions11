'use client';

import React from 'react';
import Container from '@/components/Container';

import useMediaQuery from '@mui/material/useMediaQuery';

import {
  Box,
  Button,
  Grid,
  Typography,
  Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const InvalidLink = (): JSX.Element => {
  const theme = useTheme();

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <Box
      bgcolor={theme.palette.alternate.main}
      position={'relative'}
      minHeight={'calc(100vh - 40px)'}
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
            md={11}
          >
            <Box>
              <Typography
                variant="h1"
                component={'h1'}
                align={isMdScreen ? 'left' : 'center'}
                sx={{ fontWeight: 700 }}
              >
                The link you&apos;re looking for is not here. 
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                align={isMdScreen ? 'left' : 'center'}
              >
                It&apos;s possible the link expired, or that it was copied incorrectly.<br />
                Please check with the sender and try again.
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

export default InvalidLink;