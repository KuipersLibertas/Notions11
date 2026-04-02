'use client';

import React, { useState } from 'react';
import CommonLayout from '../shared/layouts/CommonLayout';

import {
  Avatar,
  Box,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { ChartIcon, ClockIcon, ExclamationIcon, ScissorsIcon } from '@/utils/icons';
import { CustomToastOptions, PaymentMode, PricePlan } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const ProSignUp = (): JSX.Element => {
  const theme = useTheme();
  const { data: session, update } = useSession();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMode] = useState<number>(PaymentMode.Stripe);

  const items = [
    {
      title: 'Expiring Links',
      subtitle:
        'Set your links to expire whenever you want. Or after __# of downloads. Or not at all. It\'s your call.',
      icon: <ClockIcon color={theme.palette.primary.main} />,
    },
    {
      title: 'Download Analytics',
      subtitle:
        'Get analytics on your Notion links, including unique users, location and # of times accessed.',
      icon: <ChartIcon color={theme.palette.primary.main} />,
    },
    {
      title: 'Your Branding',
      subtitle:
        'Add your logo and color scheme to match your current branding.',
      icon: <ScissorsIcon color={theme.palette.primary.main} />,
    },
    {
      title: 'Download Notification',
      subtitle:
        'Enable notifications on a per-link basis to find out instantly when your files are accessed.',
      icon: <ExclamationIcon color={theme.palette.primary.main} />,
    },
  ];

  const handleProcess = async (): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch(
        '/api/gateway/upgrade-pro',
        {
          method: 'POST',
          body: JSON.stringify({
            paymentMode: paymentMode
          })
        });
      const json = await response.json();
      if (json.success) {
        if (paymentMode === PaymentMode.Balance) {
          const data = { ...session, user: { ...json.user, auth_token: session?.user.auth_token } };
          update(data);
          toast.success('Congratulation! Your account is upgraded.', CustomToastOptions);
        } else {
          window.location.href = json.url;
        }
      } else {
        toast.error(json.message, CustomToastOptions);
      }      
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <CommonLayout
      title="What's in Notions11 Pro?"
      description="Beyond everything in your already awesome Notions11 account, here's what you get with Pro:"
    >
      <Box maxWidth="1000px" mx="auto">
        <Grid container spacing={4}>
          {items.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Box
                width={1}
                height={1}
                data-aos={'fade-up'}
                data-aos-delay={i * 100}
                data-aos-offset={100}
                data-aos-duration={600}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Box
                    component={Avatar}
                    width={60}
                    height={60}
                    marginBottom={2}
                    bgcolor={alpha(theme.palette.primary.main, 0.1)}
                    color={theme.palette.primary.main}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant={'h6'}
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                    align={'center'}
                  >
                    {item.title}
                  </Typography>
                  <Typography align={'center'} color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box my={4}>
          <Divider />
        </Box>
        <Box my={4}>
          <Typography variant="h5" align="center">
            Upgrade to Notions11 Pro for ${PricePlan.Pro}/mo
          </Typography>
        </Box>
        {/* <Box display="flex" justifyContent="center" mt="3rem">
          <RadioGroup
            row
            aria-labelledby=""
            defaultValue="1"
            name="expiry-group"
            sx={{
              alignItems: 'center',
              columnGap: '30px',
            }}
            value={paymentMode}
            onChange={(e) => setPaymentMode(parseInt(e.target.value, 10))}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="Balance"
              sx={{
                mr: 0
              }}
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Credit"
              sx={{
                mr: 0
              }}
            />
          </RadioGroup>
        </Box> */}
        <Box my={2} display="flex" justifyContent="center">
          <LoadingButton
            variant="contained"
            color="error"
            loading={isProcessing}
            onClick={handleProcess}
          >
            TRY FREE FOR 15 DAYS!
          </LoadingButton>
        </Box>
      </Box>
    </CommonLayout>
  );
};

export default ProSignUp;