import shadows from './shadows';

import { Theme, responsiveFontSizes } from '@mui/material';
import { Inter } from 'next/font/google';
import { createTheme, ComponentsOverrides, alpha } from '@mui/material/styles';
import { light, dark } from '@/components/ThemeRegistry/palette';
import { ThemeMode } from '@/utils/constants';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
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
        fontFamily: inter.style.fontFamily,
        h1: { fontWeight: 700, letterSpacing: '-0.025em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 700, letterSpacing: '-0.015em' },
        h4: { fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontWeight: 600, letterSpacing: '-0.005em' },
        h6: { fontWeight: 600 },
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
        body1: { lineHeight: 1.7 },
        body2: { lineHeight: 1.65 },
      },
      shape: {
        borderRadius: 8,
      },
      zIndex: {
        appBar: 1200,
        drawer: 1300,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              borderRadius: 8,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              letterSpacing: '0.01em',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 8px 20px -4px ${alpha('#2563eb', 0.35)}`,
              },
            },
            contained: {
              boxShadow: `0 2px 8px -2px ${alpha('#2563eb', 0.25)}`,
            },
            containedPrimary: {
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                boxShadow: `0 8px 20px -4px ${alpha('#2563eb', 0.45)}`,
              },
            },
            containedSecondary: {
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                boxShadow: `0 8px 20px -4px ${alpha('#7c3aed', 0.45)}`,
              },
            },
            outlined: {
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px',
                transform: 'translateY(-1px)',
                boxShadow: 'none',
              },
            },
            sizeLarge: {
              paddingTop: 13,
              paddingBottom: 13,
              paddingLeft: 28,
              paddingRight: 28,
              fontSize: '1rem',
            },
          } as ComponentsOverrides['MuiButton'],
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          } as ComponentsOverrides['MuiInputBase'],
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              '& fieldset': {
                borderWidth: '1.5px',
              },
              '&:hover fieldset': {
                borderWidth: '1.5px',
              },
            },
            input: {
              borderRadius: 8,
            },
          } as ComponentsOverrides['MuiOutlinedInput'],
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            },
          } as ComponentsOverrides['MuiCard'],
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              fontWeight: 600,
              letterSpacing: '0.02em',
            },
          } as ComponentsOverrides['MuiChip'],
        },
        MuiAlert: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              borderRadius: 10,
              ...(ownerState.severity === 'info' && {
                backgroundColor: '#dbeafe',
                color: '#1e40af',
              }),
            }),
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
            rounded: {
              borderRadius: 16,
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: mode === ThemeMode.light ? 'rgba(15,23,42,0.08)' : 'rgba(241,245,249,0.08)',
            },
          },
        },
      },
      themeToggler,
    }),
  );

export default getTheme;
