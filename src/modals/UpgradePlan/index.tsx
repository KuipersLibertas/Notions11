import React, { useContext } from 'react';
import ApplicationContext from '@/contexts/ApplicationContext';
import Cookies from 'js-cookie';

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
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { CheckIcon } from '@/utils/icons';

type UpgradeProModalProps = {
  opened: boolean,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpgradeProModal = ({ opened }: UpgradeProModalProps): JSX.Element => {
  const theme = useTheme();
  const { setShowUpgradePlan } = useContext(ApplicationContext);

  const item = {
    title: 'Upgrade to Notions11 Pro!',
    subtitle: 'Passdropit Pro includes everything in your Free Acct plus:',
    features: [
      'Your Logo on Download Pages',
      'Passwords on Dropbox Folders',
      'Analytics on Your Dropbox Links',
      'Download Notifications',
      'Set Expiring Links',
    ],
    isHighlighted: true,
  };

  const handleClose = (): void => {
    setShowUpgradePlan(false);
    Cookies.set('__ignore_upgrade_pro', '1', { expires: 1 });
  };

  const handleUpgrade = (): void => {
    Cookies.set('__ignore_upgrade_pro', '1', { expires: 1 });
    window.location.href = '/prosignup';
  };

  return (
    <Dialog
      open={opened}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem 1rem 2rem',
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
      <DialogTitle
        variant="h5"
        fontWeight={500}
        align="center"
      >
        Upgrade to Notions11 Pro!
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4} rowSpacing={4}>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"        
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
                <Box>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleUpgrade}
        >
          Try it Free for 15days!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradeProModal;