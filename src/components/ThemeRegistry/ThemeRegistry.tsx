'use client';

import * as React from 'react';
import AOS from 'aos';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';

import NextAppDirEmotionCacheProvider from './EmotionCache';
import getTheme from './theme';

import { ThemeProvider } from '@mui/material/styles';
import { ThemeMode } from '@/utils/constants';
import { SessionProvider } from 'next-auth/react';

export const useDarkMode = (): [string, () => void, boolean] => {
  const [themeMode, setTheme] = React.useState(ThemeMode.light);
  const [mountedComponent, setMountedComponent] = React.useState(false);

  const setMode = (mode: string) => {
    try {
      window.localStorage.setItem('themeMode', mode);
    } catch {
      /* do nothing */
    }

    setTheme(mode);
  };

  const themeToggler = (): void => {
    themeMode === ThemeMode.light ? setMode(ThemeMode.dark) : setMode(ThemeMode.light);
  };

  React.useEffect(() => {
    try {
      const localTheme = window.localStorage.getItem('themeMode');
      localTheme ? setTheme(localTheme) : setMode(ThemeMode.light);
    } catch {
      setMode(ThemeMode.light);
    }

    setMountedComponent(true);
  }, []);

  return [themeMode, themeToggler, mountedComponent];
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [themeMode, themeToggler, mountedComponent] = useDarkMode();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    AOS.init({
      once: true,
      delay: 50,
      duration: 500,
      easing: 'ease-in-out',
    });
  }, []);

  React.useEffect(() => {
    AOS.refresh();
  }, [mountedComponent, themeMode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <SessionProvider>
        <ThemeProvider theme={getTheme(themeMode, themeToggler)}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Paper elevation={0}>
            {children}
          </Paper>
        </ThemeProvider>
      </SessionProvider>
    </NextAppDirEmotionCacheProvider>
  );
}