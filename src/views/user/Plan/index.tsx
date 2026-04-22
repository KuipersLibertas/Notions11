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

  // On mount, read query params and sessionStorage directly from the browser
  // (avoids Next.js useSearchParams hydration quirks).
  //
  // ?upgraded=1    — set by the upgrade-pro success route after activatePro()
  // ?from_portal=1 — set by the Stripe portal return_url
  // stripePortalReturn in sessionStorage — backup flag set in handleCancel
  //   before the browser leaves for the portal (survives the round-trip even
  //   if Stripe strips query params from the return URL).
  //
  // Sequence for portal return:
  //   1. sync-subscription  → ask Stripe for live status, update DB
  //   2. get-me             → read fresh user row from DB
  //   3. update()           → rewrite the NextAuth JWT cookie
  //   4. window.location.replace → hard reload so the new cookie is read
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgraded   = params.get('upgraded')    === '1';
    const fromPortal = params.get('from_portal') === '1'
                    || sessionStorage.getItem('stripePortalReturn') === '1';

    if (!upgraded && !fromPortal) return;

    // Clear the sessionStorage flag so it doesn't trigger on the next visit
    sessionStorage.removeItem('stripePortalReturn');

    (async () => {
      try {
        // Portal return: sync DB with live Stripe status first
        if (fromPortal) {
          await fetch('/api/gateway/sync-subscription');
        }

        // Get the freshest user row from the DB
        const r    = await fetch('/api/gateway/get-me');
        const json = await r.json();

        if (json.success && json.user) {
          // Await so the JWT cookie is fully written before we navigate
          await update({ user: { ...json.user, auth_token: session?.user?.auth_token ?? '' } });
        }
      } catch {
        // Ignore errors — the hard reload below still picks up any DB changes
      }

      // Hard navigation forces the browser to re-read the fresh JWT cookie
      window.location.replace('/user/plan');
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async (): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await fetch('/api/gateway/user-subscription');
      const json = await response.json();
      if (json.success && json.url) {
        // Set flag before leaving — survives the Stripe portal round-trip
        sessionStorage.setItem('stripePortalReturn', '1');
        window.location.href = json.url;
      } else {
        toast.error(json.message || 'Could not open subscription portal', CustomToastOptions);
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
          body: JSON.stringify({ paymentMode }),
        });
      const json = await response.json();
      if (json.success) {
        if (paymentMode === PaymentMode.Balance) {
          const data = { ...session, user: { ...json.user, auth_token: session?.user?.auth_token ?? '' } };
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
                  </Box>
                  {(initiated && ((session?.user.level && session?.user.level > UserLevel.Normal) || AppMode.Free || item.id == 0)) &&
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
      <Box display="flex" justifyContent="center" mt="3rem">
        {initiated && !AppMode.Free &&
          <LoadingButton
            variant="contained"
            color={(session?.user.level && session?.user.level >= UserLevel.Pro) ? 'warning' : 'primary'}
            loading={isProcessing}
            onClick={() => (session?.user.level && session?.user.level >= UserLevel.Pro) ? setShowConfirmPopup(true) : handleUpgrade()}
          >
            {(session?.user.level && session?.user.level >= UserLevel.Pro) ? 'Manage Subscription' : 'Upgrade'}
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
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            Twitter
          </Link>.
        </Typography>
      </Box>
      {showConfirmPopup &&
        <Confirm
          opened={showConfirmPopup}
          onClose={() => setShowConfirmPopup(false)}
          onOk={handleCancel}
          message="You'll be taken to the Stripe portal to manage your subscription.<br />Cancelling there will remove your Pro access at the end of the billing period."
        />
      }
    </UserLayout>
  );
};

export default Plan;
