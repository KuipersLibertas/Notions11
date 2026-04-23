'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import {
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ProfileSettingMenus as menus } from '@/layouts/Main/navigation';

export const UserLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  const handleMenuClick = (url: string | undefined): void => {
    if (!url) return;
    window.location.href = url;
  };

  const isLight = theme.palette.mode === 'light';

  return (
    <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* Header banner — compact, no overlap */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          py: { xs: '1rem', md: '1.25rem' },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 0, sm: 2 } }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: '#fff', mb: 0.25, letterSpacing: '-0.01em' }}
          >
            Account Settings
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Manage your plan, security, and preferences
          </Typography>
        </Box>
      </Box>

      <Container>
        <Grid container spacing={3}>
          {/* Sidebar nav */}
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                boxShadow: `0 8px 32px -8px ${alpha(theme.palette.primary.main, 0.15)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <List disablePadding sx={{ py: 1 }}>
                {menus.map((menu, index) => {
                  const isActive = activeLink === menu.href;
                  return (
                    <ListItemButton
                      key={index}
                      selected={isActive}
                      onClick={() => handleMenuClick(menu.href)}
                      sx={{
                        mx: 1,
                        mb: 0.25,
                        borderRadius: 2,
                        py: 1.25,
                        px: 1.5,
                        gap: 1,
                        transition: 'all 0.15s',
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.main',
                          },
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      {menu.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color: isActive ? 'primary.main' : 'text.secondary',
                            transition: 'color 0.15s',
                          }}
                        >
                          {menu.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={menu.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'primary.main' : 'text.primary',
                        }}
                      />
                      {menu.id === 'upload_logo' && (
                        <Chip
                          label="Pro"
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 18,
                            fontWeight: 700,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            color: 'secondary.main',
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                          }}
                        />
                      )}
                    </ListItemButton>
                  );
                })}
              </List>
            </Card>
          </Grid>

          {/* Main content */}
          <Grid item xs={12} md={9}>
            <Card
              sx={{
                boxShadow: `0 8px 32px -8px ${alpha(theme.palette.primary.main, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                borderRadius: 3,
                p: { xs: 3, md: 4 },
              }}
            >
              {children}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserLayout;
