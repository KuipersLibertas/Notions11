'use client';

import React from 'react';
import ThemeToggler from '@/components/ThemeToggler';
import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { AppMode, UserLevel } from '@/utils/constants';
import { Images } from '@/utils/assets';
import { IMenu } from '@/layouts/Main/navigation';
import { signOut, useSession } from 'next-auth/react';

type SidebarProps = {
  onClose: () => void;
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary' | undefined;
  menus: IMenu[];
};

const Sidebar = ({ onClose, open, variant, menus }: SidebarProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { mode: themeMode } = theme.palette;

  const [activeLink, setActiveLink] = useState('');
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  const handleSubMenuClick = async (menu: IMenu): Promise<void> => {
    if (menu.id === 'sign_out') {
      try {
        await fetch('/api/gateway/logout');
      } catch (error) {
        console.log(error);
      }
      signOut({ redirect: false }).then(() => {
        window.location.href = '/';
      });
    } else {
      window.location.href = menu.href!;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <Drawer
      anchor="left"
      onClose={() => onClose()}
      open={open}
      variant={variant}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: 300,
          borderRight: 'none',
          borderRadius: '0 20px 20px 0',
          boxShadow: `12px 0 40px -8px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2.5}
          py={2}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          }}
        >
          <Box component="a" href="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={Images.MainLogo}
              sx={{ height: 60, width: 'auto', display: 'block' }}
              alt="Notions11"
            />
          </Box>
          <ThemeToggler />
        </Box>

        {/* Nav items */}
        <Box flex={1} sx={{ overflowY: 'auto' }} px={1.5} py={2}>
          <List disablePadding>
            {menus.map((menu: IMenu, index: number) => (
              <Box key={index} mb={0.5}>
                {menu.pages && menu.pages.length > 0 ? (
                  <>
                    <ListItemButton
                      onClick={() => toggleExpand(menu.id)}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        px: 1.5,
                        color: 'text.primary',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        },
                      }}
                    >
                      {menu.icon && (
                        <ListItemIcon
                          sx={{ minWidth: 32, color: 'text.secondary' }}
                        >
                          {menu.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={menu.title}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      />
                      {expandedMenuId === menu.id ? (
                        <ExpandLessIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      ) : (
                        <ExpandMoreIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      )}
                    </ListItemButton>

                    <Collapse in={expandedMenuId === menu.id} timeout="auto">
                      <Box pl={2} mt={0.5}>
                        {menu.pages
                          .filter(
                            (m: IMenu) =>
                              m.level! < UserLevel.Admin &&
                              ((session?.user.level != null && m.level! <= session.user.level) ||
                                AppMode.Free),
                          )
                          .map((subMenu: IMenu, i: number) => (
                            <ListItemButton
                              key={i}
                              onClick={() => handleSubMenuClick(subMenu)}
                              sx={{
                                borderRadius: 2,
                                py: 0.875,
                                px: 1.5,
                                mb: 0.25,
                                gap: 1,
                                backgroundColor:
                                  activeLink === subMenu.href
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : 'transparent',
                                color:
                                  activeLink === subMenu.href
                                    ? 'primary.main'
                                    : 'text.primary',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                                },
                              }}
                            >
                              {subMenu.icon && (
                                <Box sx={{ display: 'flex', color: 'inherit', opacity: 0.7 }}>
                                  {subMenu.icon}
                                </Box>
                              )}
                              <Typography
                                fontSize="0.875rem"
                                fontWeight={activeLink === subMenu.href ? 600 : 500}
                                color="inherit"
                              >
                                {subMenu.title}
                              </Typography>
                              {subMenu.id === 'sign_out' && (
                                <Typography
                                  component="span"
                                  fontSize="0.78rem"
                                  color="text.secondary"
                                  ml={0.25}
                                >
                                  ({session?.user.user_name.split(' ')[0]})
                                </Typography>
                              )}
                            </ListItemButton>
                          ))}

                        {menu.id === 'profile' && session?.user.level === UserLevel.Admin && (
                          <>
                            <Box px={1.5} py={0.5} display="flex" gap={1} alignItems="center">
                              <Chip
                                label="Admin"
                                size="small"
                                color="secondary"
                                sx={{ fontSize: '0.68rem', height: 20, fontWeight: 700 }}
                              />
                              <Divider sx={{ flex: 1 }} />
                            </Box>
                            {menu.pages
                              .filter((m: IMenu) => m.level! === UserLevel.Admin)
                              .map((subMenu: IMenu, i: number) => (
                                <ListItemButton
                                  key={i}
                                  onClick={() => handleSubMenuClick(subMenu)}
                                  sx={{
                                    borderRadius: 2,
                                    py: 0.875,
                                    px: 1.5,
                                    mb: 0.25,
                                    gap: 1,
                                    color:
                                      activeLink === subMenu.href
                                        ? 'primary.main'
                                        : 'text.primary',
                                    backgroundColor:
                                      activeLink === subMenu.href
                                        ? alpha(theme.palette.primary.main, 0.08)
                                        : 'transparent',
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.06),
                                    },
                                  }}
                                >
                                  {subMenu.icon && (
                                    <Box sx={{ display: 'flex', color: 'inherit', opacity: 0.7 }}>
                                      {subMenu.icon}
                                    </Box>
                                  )}
                                  <Typography fontSize="0.875rem" fontWeight={500} color="inherit">
                                    {subMenu.title}
                                  </Typography>
                                </ListItemButton>
                              ))}
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    component="a"
                    href={menu.href}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 1.5,
                      gap: 1,
                      backgroundColor:
                        activeLink === menu.href
                          ? alpha(theme.palette.primary.main, 0.08)
                          : 'transparent',
                      color: activeLink === menu.href ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                  >
                    {menu.icon && (
                      <Box sx={{ display: 'flex', color: 'inherit', opacity: 0.7 }}>
                        {menu.icon}
                      </Box>
                    )}
                    <Typography
                      fontSize="0.9rem"
                      fontWeight={activeLink === menu.href ? 600 : 500}
                      color="inherit"
                    >
                      {menu.title}
                    </Typography>
                  </ListItemButton>
                )}
              </Box>
            ))}
          </List>
        </Box>

        {/* Bottom CTA for unauthenticated */}
        {!session?.user && (
          <Box px={2} pb={3} pt={1} sx={{ borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
            <Button
              variant="contained"
              fullWidth
              href="/signup"
              component="a"
              sx={{ mb: 1 }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              fullWidth
              href="/signin"
              component="a"
              sx={{ borderColor: alpha(theme.palette.primary.main, 0.4) }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
