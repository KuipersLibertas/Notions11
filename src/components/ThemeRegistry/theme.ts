import shadows from './shadows';

import { Theme, responsiveFontSizes } from '@mui/material';
import { Open_Sans } from 'next/font/google';
import { createTheme, ComponentsOverrides } from '@mui/material/styles';
import { light, dark } from '@/components/ThemeRegistry/palette';
import { ThemeMode } from '@/utils/constants';

const openSans = Open_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      alternate: {
        main: string;
        dark: string;
      },
      cardShadow: string;
      mode: string;
      common: {
        white: string;
        black: string;
        gray: string;
      }
      primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      },
      secondary: {
        light: string;
        main: string;
        dark: string;
        contrastText: string;
      },
      text: {
        primary: string;
        secondary: string;
      },
      divider: string;
      background: {
        paper: string;
        default: string;
        level2: string;
        level1: string;
      }
    }
    themeToggler: () => void;
  }

  interface ThemeOptions {    
    themeToggler: () => void;
  }
}

const getTheme = (mode: string, themeToggler: () => void): Theme =>
  responsiveFontSizes(
    createTheme({
      palette: mode === ThemeMode.light ? light : dark,
      shadows: shadows(mode),
      typography: {
        fontFamily: openSans.style.fontFamily, //'"Inter", sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 'medium' as React.CSSProperties['fontWeight'],
        },
      },
      zIndex: {
        appBar: 1200,
        drawer: 1300,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              fontWeight: 400,
              borderRadius: 5,
              paddingTop: 10,
              paddingBottom: 10,
            },
            containedSecondary: mode === ThemeMode.light ? { color: 'white' } : {},
          } as ComponentsOverrides['MuiButton'],
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderRadius: 5,
            },
          } as ComponentsOverrides['MuiInputBase'],
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 5,
            },
            input: {
              borderRadius: 5,
            },
          } as ComponentsOverrides['MuiOutlinedInput'],
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          } as ComponentsOverrides['MuiCard'],
        },
        MuiAlert: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              ...(ownerState.severity === 'info' && {
                backgroundColor: '#60a5fa',
              }),
            }),
          },
        },
      },
      themeToggler,
    }),
  );


export default getTheme;