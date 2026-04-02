import React, { useCallback, useContext, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@/components/Container';
import ApplicationContext from '@/contexts/ApplicationContext';

import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Button,
  Chip
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import {
  ScissorsIcon,
  LinkIcon,
  ChartIcon,
  ExclamationIcon,
  ClockIcon,
} from '@/utils/icons';
import { ThemeMode } from '@/utils/constants';
import PlanPrice from '@/modals/PlanPrice';

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

  const SpecialFeatureButton = ({title, type}: { title: string, type: 'filled'|'outlined' }): JSX.Element => {
    if (type === 'filled') {
      return (
        <Chip
          component="button"
          variant={type}
          label={title}
          color="success"
          sx={{
            color: 'common.white',
            py: '0.2rem',
            px: '0.3rem',
            mb: '0.35em',
            height: 'unset',
            textTransform: 'uppercase'
          }}
          onClick={() => handleShowPopup()}
        />
      );
    } else {
      return (
        <Chip
          component="button"
          variant={type}
          label={title}
          color={theme.palette.mode === ThemeMode.dark ? 'secondary' : undefined}
          sx={{
            py: '0.18rem',
            px: '0.4rem',
            mb: '0.35em',
            height: 'unset',
          }}
          onClick={() => handleShowPopup()}
        />
      );
    }
  };

  const items = [
    {
      title: 'Unlimited Links',
      description: 'The title kind of says it all. Share as many secure links as you want.',
      icon: (<Typography fontSize="2.5rem" color={theme.palette.background.default}>∞</Typography>)
    },
    {
      title: 'Customized URLs',
      description: 'notions11.com/randomstuff becomes notions11.com/YouAreAwesome!',
      icon: <LinkIcon color={theme.palette.background.default} />
    },
    {
      title: 'Access Analytics',
      description: 'Get analytics on your Notion links, including unique users, location and # of times accessed.',
      icon: <ChartIcon color={theme.palette.background.default} />
    },
    {
      title: 'Access Notification',
      description: 'Enable notifications on a per-link basis to find out instantly when your links are accessed.',
      icon: <ExclamationIcon color={theme.palette.background.default} />,
      func: <SpecialFeatureButton title="Pro" type="outlined" />
    },
    {
      title: 'Expiring Links',
      description: 'Set your links to expire whenever you want. Or after any # of downloads. Or not at all. It\'s your call.',
      icon: <ClockIcon color={theme.palette.background.default} />,
      func: <SpecialFeatureButton title="Pro" type="outlined" />
    },
    {
      title: 'Your Branding',
      description: 'Add your logo and color scheme to match your current branding.',
      icon: <ScissorsIcon color={theme.palette.background.default} />,
      func: <SpecialFeatureButton title="New!" type="filled" />
    }, 
  ];

  return (
    <Box
      id="features"
      position="relative"
      sx={{
        backgroundColor: 'alternate.main',
      }}
    >
      <Container sx={{ maxWidth: { md: 1236 } }}>
        <Box 
          sx={{
            py: { xs: '2.5rem', md: '4rem' }
          }}
        >
          <Box marginBottom={4}>
            <Typography
              fontWeight={700}
              variant="h4"
              textAlign="center"
              data-aos="fade"
              data-aos-duration={600}
            >
            Features Explained
            </Typography>
            <Typography
              fontWeight={300}
              variant="h6"
              marginTop="0.875rem"
              textAlign="center"
              color="text.secondary"
              data-aos="fade-up"
              data-aos-duration="600"
            >
            Sometimes you want a little more security <u>and functionality</u>. Add FREE passwords to your Notion links, plus get customized URLs, expiring links, access analytics, access notifications, and more...
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {items.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  component={Card}
                  padding={4}
                  width={1}
                  height={1}
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                  data-aos-offset={100}
                  data-aos-duration={600}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box
                      component={Avatar}
                      width={50}
                      height={50}
                      marginBottom={2}
                      bgcolor={theme.palette.primary.main}
                      color={theme.palette.background.paper}
                    >
                      {item.icon}
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap={1}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        {item.title}
                      </Typography>
                      {item.func&& item.func}
                    </Box>
                    <Typography
                      color="text.secondary"                      
                      textAlign="center"
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          {!authenticated&&
            <Box
              display="flex"
              justifyContent="center"
              paddingTop={{ xs: '1.5rem', md: '3rem' }}
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
          }
        </Box>
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
      {showPlanPricePopup&&
        <PlanPrice
          opened={showPlanPricePopup}
          onClose={() => setShowPlanPricePopup(false)}
        />
      }
    </Box>
  );
};

export default Features;