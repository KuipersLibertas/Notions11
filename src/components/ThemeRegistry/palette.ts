import { PaletteMode } from '@mui/material';
import { ThemeMode } from '@/utils/constants';

export const light = {
  alternate: {
    main: '#f8fafc',
    dark: '#f1f5f9',
  },
  cardShadow: 'rgba(37, 99, 235, 0.06)',
  mode: ThemeMode.light as PaletteMode,
  common: {
    black: '#000',
    white: '#fff',
    gray: 'rgba(203, 213, 225, 1)',
  },
  primary: {
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#fff',
  },
  secondary: {
    main: '#7c3aed',
    light: '#a78bfa',
    dark: '#5b21b6',
    contrastText: '#fff',
  },
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
  },
  divider: 'rgba(15, 23, 42, 0.08)',
  background: {
    paper: '#ffffff',
    default: '#ffffff',
    level2: '#f8fafc',
    level1: '#f1f5f9',
  },
};

export const dark = {
  alternate: {
    main: '#1e293b',
    dark: '#0f172a',
  },
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  common: {
    black: '#000',
    white: '#fff',
    gray: 'rgba(71, 85, 105, 1)',
  },
  mode: ThemeMode.dark as PaletteMode,
  primary: {
    main: '#3b82f6',
    light: '#93c5fd',
    dark: '#2563eb',
    contrastText: '#fff',
  },
  secondary: {
    main: '#8b5cf6',
    light: '#c4b5fd',
    dark: '#7c3aed',
    contrastText: '#fff',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
  divider: 'rgba(241, 245, 249, 0.08)',
  background: {
    paper: '#1e293b',
    default: '#0f172a',
    level2: '#334155',
    level1: '#1e293b',
  },
};
