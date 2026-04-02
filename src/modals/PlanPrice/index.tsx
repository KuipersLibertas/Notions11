import React, { useContext } from 'react';
import ApplicationContext from '@/contexts/ApplicationContext';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Slide,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PricePlan } from '@/utils/constants';
import { CheckIcon } from '@/utils/icons';
import { TransitionProps } from '@mui/material/transitions';

type PlanPriceModalProps = {
  opened: boolean,
  onClose: () => void,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const PlanPrice = ({ opened, onClose }: PlanPriceModalProps): JSX.Element => {
  const theme = useTheme();
  const { authenticated } = useContext(ApplicationContext);

  const items = [
    {
      title: 'Free Account',
      subtitle: '',
      price: 0,
      features: [
        'Unlimited Passdropit Links',
        'Customize Links and Passwords',
        'Send-It-Then',
        'Edit/Manage Your Links',
        'Multi-File Passdrops'
      ],
      isHighlighted: false,
    },
    {
      title: 'Pro',
      subtitle: 'Includes everything in the Free Acct plus:',
      price: { monthly: `$${PricePlan.Pro}` },
      features: [
        'Analytics on Your Links',
        'Emailed Download Notifications',
        'Expiring Links',
        'Dropbox Folders',
      ],
      isHighlighted: true,
    }
  ];

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem 1rem 2rem',
          maxWidth: '55rem',
          borderRadius: '15px',
        },
        '& .MuiDialogContent-root': {
          paddingTop: '2rem',
          paddingBottom: '2rem'
        },
        '& .MuiDialogActions-root': {
          paddingTop: '2rem',
        },
      }}
    >
      <DialogTitle variant="h5" fontWeight={500} align="center">Plans and Pricing</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4} rowSpacing={4}>
          {items.map((item, i) => (
            <Grid
              item
              xs={12}
              md={6}
              key={i}
              display="flex"
              justifyContent={{
                xs: 'center',
                md: i % 2 === 0 ? 'flex-end' : 'flex-start'
              }}        
            >
              <Box
                component={Card}
                height={1}
                display="flex"
                flexDirection="column"
                variant="elevation"
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
                    {(typeof item.price !== 'number')&&
                      <Box
                        display="flex"
                        alignItems="baseline"
                      >
                        <Typography variant="h4" fontWeight={700}>
                          {item.price.monthly}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          fontWeight={700}
                        >
                          {'/mo'}
                        </Typography>
                      </Box>
                    }
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
                          <ListItemText primary={feature} />
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
        <Box mt={3}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            align="center"
          >
            The no-account option allows passwords on unlimited Dropbox files, one a time, without the ability to edit/delete/manage them later on.
          </Typography>
        </Box>
      </DialogContent>
      {!authenticated&&
        <DialogActions sx={{ flexDirection: 'column' }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            href="/signup"
          >
            Sign up for a Free Account!
          </Button>
          <Box mt={2}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              align="center"
            >
              Want to go Pro? Signup for a free account and upgrade from your settings page.
            </Typography>
          </Box>
        </DialogActions>
      }
    </Dialog>
  );
};

export default PlanPrice;