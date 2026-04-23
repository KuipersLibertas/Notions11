'use client';

import React, { useState, useRef, useEffect } from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Container from '@/components/Container';
import Topbar from '@/layouts/Main/Topbar';
import Sidebar from '@/layouts/Main/Sidebar';
import Footer from '@/layouts/Main/Footer';
import SignIn from '@/modals/auth/SignIn';
import ForgotPassword from '@/modals/auth/ForgotPassword';
import UpgradePlan from '@/modals/UpgradePlan';
import Cookies from 'js-cookie';

import {
  AppBar,
  Box,
} from '@mui/material';
import { useNavigationMenu } from '@/layouts/Main/navigation';
import { ApplicationProvider } from '@/contexts/ApplicationContext';
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { AppMode, UserLevel } from '@/utils/constants';

type MainLayoutProps = {
  children: React.ReactNode,
  mode?: number,
}
const MainLayout = ({
  mode = 1,
  children,
}: MainLayoutProps): JSX.Element => {
  const { data: session } = useSession();
  
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showUpgradePlan, setShowUpgradePlan] = useState<boolean>(false);
  
  const authenticatedRef = useRef<boolean>(false);
  
  const menus = useNavigationMenu(!!session);

  const [appState, setAppState] = useState({
    setShowSignIn,
    setShowForgotPassword,
    setShowUpgradePlan,
    authenticated: authenticatedRef.current,
    lang: 'en',
  });

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 38,
  });

  useEffect(() => {
    if (!session?.user) return;
    if (mode === 1 && !AppMode.Free) {
      const flag = Cookies.get('__ignore_upgrade_pro');
      if (session?.user.level === UserLevel.Normal && !flag) {
        setShowUpgradePlan(true);
      }
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user.id) {
      authenticatedRef.current = true;
    } else {
      authenticatedRef.current = false;
    }

    setAppState({
      ...appState,
      authenticated: authenticatedRef.current
    });
  }, [session?.user]);

  const handleSidebarOpen = (): void => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = (): void => {
    setOpenSidebar(false);
  };

  return (
    <Box>
      <SessionProvider>
        <ApplicationProvider value={appState}>
          {mode === 1&&
            <>
              <AppBar
                position={'sticky'}
                sx={{
                  top: 0,
                  backgroundColor: trigger
                    ? 'rgba(255,255,255,0.85)'
                    : 'background.paper',
                  backdropFilter: trigger ? 'blur(20px)' : 'none',
                  WebkitBackdropFilter: trigger ? 'blur(20px)' : 'none',
                  borderBottom: trigger ? '1px solid rgba(15,23,42,0.06)' : 'none',
                  transition: 'all 0.3s ease',
                  '.dark &': {
                    backgroundColor: trigger
                      ? 'rgba(15,23,42,0.85)'
                      : 'background.paper',
                  },
                }}
                elevation={0}
              >
                <Container paddingY={0} sx={{ display: 'flex', alignItems: 'center', height: '68px' }}>
                  <Topbar
                    onSidebarOpen={handleSidebarOpen}
                    menus={menus}
                  />
                </Container> 
              </AppBar>
              <Sidebar
                onClose={handleSidebarClose}
                open={openSidebar}
                variant="temporary"
                menus={menus}
              />
              <Box
                component="main"
              >
                {children}
                {showSignIn&& <SignIn opened={showSignIn} />}
                {showForgotPassword&& <ForgotPassword opened={showForgotPassword} />} 
                {showUpgradePlan&& <UpgradePlan opened={showUpgradePlan} />}         
              </Box>
              <Footer />
            </>
          }
          {mode === 2&&
            <Box>
              {children}
              {showSignIn&& <SignIn opened={showSignIn} />}
              {showForgotPassword&& <ForgotPassword opened={showForgotPassword} />} 
              {showUpgradePlan&& <UpgradePlan opened={showUpgradePlan} />}    
            </Box>
          } 
        </ApplicationProvider>
      </SessionProvider>
    </Box>
  );
};

export default MainLayout;