import React, { useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';

import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckIcon } from '@/utils/icons';

interface IFeature {
  id: number,
  title: string,
}

interface IPricing {
  title: string,
  price: { monthly: number } | number,
  features: number[],
}

const PricingCompareTable = (): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const features: IFeature[] = [
    {
      id: 1,
      title: 'Passwords on Notion Links',
    },
    {
      id: 2,
      title: 'Customized URLs',
    },
    {
      id: 3,
      title: 'Expiring Links',
    },
    {
      id: 4,
      title: 'Basic Analytics on Links'
    },
    {
      id: 5,
      title: 'Advanced Analytics on Links'
    },
    {
      id: 6,
      title: 'Access Notifications'
    },
    {
      id: 7,
      title: 'Branded Download Page'
    }
  ];

  const pricing: IPricing[] = [
    {
      title: 'Notions11 Pro (Now FREE!)',
      price: 0,
      features: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      title: 'Notions11 ($0)',
      price: 0,
      features: [1, 2, 4],
    },
    {
      title: 'Notion ($0)',
      price: 0,
      features: []
    },
  ];

  return (
    <Container id="compare-options" sx={{ maxWidth: { md: 1236 } }}>
      <Box
        sx={{
          py: { xs: '2rem', md: '4rem' }
        }}
      >
        <Box marginBottom={4}>
          <Typography
            fontWeight={700}
            variant="h4"
            textAlign="center"
            data-aos="fade-up"
            data-aos-offset={100}
            data-aos-duration="600"
          >
            Why add Notions11 to Notion?
          </Typography>
          <Box maxWidth="62rem" mx="auto">
            <Typography
              fontWeight={300}
              variant="h6"
              marginTop="0.875rem"
              textAlign="center"
              color="text.secondary"
              data-aos="fade-up"
              data-aos-offset={100}
              data-aos-duration={600}
            >
              Adding Notions11 to your Notion account opens up lots of additional functionality, and can save you money.
              See what you can do with Notions11 and Notion together, vs Notion alone.
            </Typography>
          </Box>
        </Box>
        <Box>
          <TableContainer
            component={Paper}
            elevation={0}
            data-aos={'fade-up'}
            data-aos-delay={100}
            data-aos-offset={100}
            data-aos-duration={600}
          >
            <Table aria-label="caption table" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Features</TableCell>
                  {pricing.map((item: IPricing, index: number) => (
                    <TableCell align="center" key={index}>
                      <Typography
                        sx={{ fontWeight: 'medium' }}
                      >
                        {item.title}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {features.map((feature: IFeature) => (
                  <TableRow key={feature.id}>
                    <TableCell component="th" scope="row">
                      {feature.title}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        {pricing[0].features.indexOf(feature.id) !== -1 ? (
                          <Box
                            component={Avatar}
                            bgcolor={theme.palette.secondary.main}
                            width={20}
                            height={20}
                          >
                            <CheckIcon />
                          </Box>
                        ) : (
                          ''
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        {pricing[1].features.indexOf(feature.id) !== -1 ? (
                          <Box
                            component={Avatar}
                            bgcolor={theme.palette.secondary.main}
                            width={20}
                            height={20}
                          >
                            <CheckIcon />
                          </Box>
                        ) : (
                          ''
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center">
                        {pricing[2].features.indexOf(feature.id) !== -1 ? (
                          <Box
                            component={Avatar}
                            bgcolor={theme.palette.secondary.main}
                            width={20}
                            height={20}
                          >
                            <CheckIcon />
                          </Box>
                        ) : (
                          ''
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          paddingTop="3rem"
          paddingBottom="0.75rem"
          data-aos="fade"
          data-aos-duration={600}
        >
          <Typography
            fontWeight="400"
            component="p"
            textAlign="center"
          >
            Supercharge your Notion with Notions11 and Notions11 Pro!
          </Typography>
        </Box>
        {!authenticated&&
          <>
            <Box
              display="flex"
              justifyContent="center"
              paddingY="0.75rem"
              data-aos="fade"
              data-aos-duration={600}
            >
              <Button
                variant="contained"
                component="button"
                color="error"
                size="large"
                fullWidth={isMdScreen ? false : true}
              >
                Create a Free Notions11 Account!
              </Button>
            </Box>
            <Box
              paddingTop="1.5rem"
              data-aos="fade"
              data-aos-duration={600}
            >
              <Typography
                fontSize="0.875rem"
                color="text.secondary"
                textAlign="center"
              >
                <strong>Want to go Pro?</strong> Signup for a free account and upgrade from your settings page.
              </Typography>
            </Box>
          </>
        }
      </Box>
    </Container>
  );
};

export default PricingCompareTable;