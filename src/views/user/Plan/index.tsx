'use client';

import React, { useEffect, useState } from 'react';
import UserLayout from '@/views/shared/layouts/UserLayout';

import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  ListItem,
  Avatar,
  ListItemText,
  Link,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PricePlan, UserLevel, CustomToastOptions, AppMode, PaymentMode } from '@/utils/constants';
import { CheckIcon } from '@/utils/icons';
import { useSession } from 'next-auth/react';
import Confirm from '@/modals/Confirm';

const Plan = (): JSX.Element => {
  const { data: session, update } = useSession();

  const [initiated, setInitiated] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentMode] = useState<number>(PaymentMode.Stripe);
  const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

  const items = [
    {
      id: 0,
      title: 'Free Account',
      subtitle: '',
      price: 0,
      features: [
        'Unlimited Notions11 Links',
        'Customize Links and Passwords',
        'Edit/Manage Your Links',
      ],
      isHighlighted: false,
    },
    {
      id: 1,
      title: 'Pro Account',
      subtitle: 'Includes everything in the Free Acct plus:',
      price: { monthly: `$${PricePlan.Pro}` },
      features: [
        'Your Logo on Download Page',
        'Analytics on Your Links',
        'Get Emailed Download Notifications',
        'Set Expiring Links',
      ],
      isHighlighted: true,
    }
  ];

  useEffect(() => {
    if (initiated) return;

    setInitiated(true);
  }, []);

  const handleCancel = async (): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/gateway/cancel-pro');
      const json = await response.json();
      if (json.success) {
        const data = { ...session, user: { ...json.user, auth_token: session?.user.auth_token } };
        console.log(data);
        update(data);
        toast.success('Sorry, Your account is cancelled.', CustomToastOptions);
      } else {
        toast.error(json.message, CustomToastOptions);
      }
      
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = async (): Promise<void> => {
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
    <UserLayout>
      <Box mb="2rem">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Your Plan
        </Typography>
      </Box>
      <Divider />
      <Grid container spacing={8} rowSpacing={4} mt="1rem">
        {items.map((item, i) => (
          <Grid
            item
            xs={12}
            md={6}
            key={i}
            display="flex"
            justifyContent={{ xs: 'center', md: i % 2 === 0 ? 'flex-end' : 'flex-start' }}
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
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Typography variant="h4" fontWeight={600}>
                      {item.title}
                    </Typography>
                    {/* {item.id > 0&&
                      <Box
                        display="flex"
                        alignItems="baseline"
                        mt={0.5}
                      >
                        {'('}&nbsp;
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                          {(item.price as any).monthly}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          fontWeight={700}
                        >
                          {'/mo'}
                        </Typography>
                        &nbsp;{')'}
                      </Box>
                    } */}
                  </Box>
                  {(initiated&& ((session?.user.level && session?.user.level > UserLevel.Normal) || AppMode.Free || item.id == 0))&&
                    <Box
                      component={Avatar}
                      bgcolor="secondary.main"
                      width={20}
                      height={20}
                    >
                      <CheckIcon />
                    </Box>
                  }
                </Box>
                <Box py="0.5rem">
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
      {/*(session?.user.level === UserLevel.Normal && !AppMode.Free)&&
        <Box display="flex" justifyContent="center" mt="3rem">
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
        </Box>
            */}
      <Box display="flex" justifyContent="center" mt="3rem">
        {initiated && !AppMode.Free &&
          <LoadingButton
            variant="contained"
            color={(session?.user.level && session?.user.level >= UserLevel.Pro) ? 'warning' : 'primary'}
            loading={isProcessing}
            onClick={() => (session?.user.level && session?.user.level >= UserLevel.Pro) ? setShowConfirmPopup(true) : handleUpgrade()}
          > 
            {(session?.user.level && session?.user.level >= UserLevel.Pro) ? 'Cancel Account' : 'Upgrade'}
          </LoadingButton>
        }
      </Box>
      <Box py="2rem" textAlign="center">
        <Typography variant="subtitle2" color="text.secondary">
          Notions11 is always improving, and we would love to hear your feedback, via&nbsp;
          <Link
            href="mailto:contact@notions11.com"
            sx={{ textDecoration: 'none' }}
          >
            Email
          </Link>
          &nbsp;or&nbsp;
          <Link
            href="https://x.com/Notions_11"
            sx={{ textDecoration: 'none' }}
          >
            Twitter
          </Link>.
        </Typography>
      </Box>
      {showConfirmPopup&&
        <Confirm
          opened={showConfirmPopup}
          onClose={() => setShowConfirmPopup(false)}
          onOk={handleCancel}
          message="Are you sure ?<br />All link expiries, analytics and notifications will be lost."
        />
      }
    </UserLayout>
  );
};

export default Plan;