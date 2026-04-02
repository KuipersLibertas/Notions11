import React, { useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { CheckIcon } from '@/utils/icons';

const Pricing = (): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  });
  const items = [
    {
      title: 'Free Account',
      subtitle: '',
      price: 0,
      features: [
        {
          text: 'Unlimited Notions11 Links',
          isNew: false,
        },
        {
          text: 'Customize Links and Passwords',
          isNew: false,
        },
        {
          text: 'Edit/Manage Your Links',
          isNew: false,
        },
        {
          text: 'Basic Analytics',
          isNew: false,
        },
      ],
      isHighlighted: false,
    },
    {
      title: 'Pro: Now FREE!',
      subtitle: 'Everything in the Free Acct plus:',
      price: 0,
      features: [
        {
          text: 'Advanced Analytics on Your Links',
          isNew: false,
        },
        {
          text: 'Get Emailed Access Notifications',
          isNew: false,
        },
        {
          text: 'Set Expiring Links',
          isNew: false,
        },
        {
          text: 'Your Branding on Download Pages ',
          isNew: true,
        },
      ],
      isHighlighted: true,
    }
  ];

  return (
    <Box
      id="plan-and-pricing"
      sx={{
        pt: { xs: '1rem', md: '2rem' },
        pb: { xs: '2rem', md: '4rem' }
      }}
    >
      <Container sx={{ maxWidth: { md: 1236 } }}>
        <Box marginBottom={4}>
          <Typography
            fontWeight={700}
            variant="h4"
            textAlign="center"
            data-aos="fade"
            data-aos-duration={600}
          >
          Plans and Pricing
          </Typography>
          <Typography
            fontWeight={300}
            variant="h6"
            marginTop="0.875rem"
            textAlign="center"
            color="text.secondary"
            data-aos="fade"
            data-aos-duration={600}
          >
          No Account. Free Account. Pro Account. See the details below...
          </Typography>
        </Box>
        <Grid container spacing={8} rowSpacing={4}>
          {items.map((item, i) => (
            <Grid
              item
              xs={12}
              md={6}
              key={i}
              display="flex"
              justifyContent={{ xs: 'center', md: i % 2 === 0 ? 'flex-end' : 'flex-start' }}        
              data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
              data-aos-delay={i * 100}
              data-aos-offset={100}
              data-aos-duration={600}
            >
              <Box
                component={Card}
                height={1}
                display="flex"
                flexDirection="column"
                variant="outlined"
                maxWidth={400}
              >
                <CardContent
                  sx={{
                    padding: 4,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="h4" fontWeight={600}>
                      {item.title}
                    </Typography>
                  </Box>
                  <Box py={1}>
                    <Typography color="text.secondary">
                      {item.subtitle}
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    {item.features.map((feature, j) => (
                      <Grid
                        item
                        xs={12}
                        key={j}
                      >
                        <Box
                          component={ListItem}
                          disableGutters
                          width="auto"
                          padding={0}
                        >
                          <Box
                            component={ListItemAvatar}
                            minWidth="auto !important"
                            marginRight={2}
                          >
                            <Box
                              component={Avatar}
                              bgcolor={theme.palette.primary.main}
                              width={20}
                              height={20}
                            >
                              <CheckIcon />
                            </Box>
                          </Box>
                          <ListItemText primary={feature.text} />
                          {feature.isNew&& <Chip color="success" label="NEW" />}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
                <Box flexGrow={1} />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          paddingTop="3rem"
          paddingBottom="0.75rem"
          maxWidth={1100}
          mx="auto"
          data-aos="fade"
          data-aos-duration={600}
        >
          <Typography
            fontWeight="400"
            component="p"
            textAlign="center"
          >
            You CAN use Notions11 with no account at all, for unlimited # of links with limited functionality, but without without the ability to edit/delete/manage them later on.
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
                Create a Free Account!
              </Button>
            </Box>
            <Box paddingTop="1.5rem">
              <Typography
                fontSize="0.875rem"
                color="text.secondary"
                textAlign="center"
                data-aos="fade"
                data-aos-duration={600}
              >
                <strong>Want to go Pro?</strong> Signup for a free account and upgrade from your settings page.
              </Typography>
            </Box>
          </>
        }
      </Container>
    </Box>
  );
};

export default Pricing;