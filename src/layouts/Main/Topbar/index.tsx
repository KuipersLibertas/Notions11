'use client';

import React, { useContext } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggler from '@/components/ThemeToggler';
import ApplicationContext from '@/contexts/ApplicationContext';

import { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Typography,
  Popover,
  Grid,
  Divider,
  IconButton,
  Link,
  Chip,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { AppMode, ThemeMode, UserLevel } from '@/utils/constants';
import { Images } from '@/utils/assets';
import { IMenu } from '@/layouts/Main/navigation';
import { signOut, useSession } from 'next-auth/react';

type TopbarProps = {
  menus: IMenu[];
  onSidebarOpen: () => void;
};

const Topbar = ({ menus, onSidebarOpen }: TopbarProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { mode: themeMode } = theme.palette;
  const { authenticated } = useContext(ApplicationContext);

  const [activeLink, setActiveLink] = useState('');
  const [anchorEl, setAnchorEl] = useState<Element>();
  const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
  const [initiated, setInitiated] = useState<boolean>(false);

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
    if (initiated) return;
    setInitiated(true);
  }, []);

  const hasActiveLink = (key: string): boolean => {
    const menu = menus.find((v) => v.id === key);
    if (menu) return menu.href === activeLink;
    return false;
  };

  const handleClick = (e: React.MouseEvent<Element, MouseEvent>, key: string) => {
    e.preventDefault();
    setAnchorEl(e.target as Element);
    setOpenedPopoverId(key);
  };

  const handleClose = (): void => {
    setOpenedPopoverId(null);
    setAnchorEl(undefined);
  };

  const handleSubMenuClick = async (menu: IMenu): Promise<void> => {
    if (menu.id === 'sign_out') {
      setOpenedPopoverId(null);
      setAnchorEl(undefined);
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

  const isLight = themeMode === ThemeMode.light;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width={1}>
      {/* Logo */}
      <Box
        display="flex"
        component="a"
        href="/"
        title="Notions11"
        sx={{ textDecoration: 'none', flexShrink: 0 }}
      >
        <Box
          component="img"
          src={isLight ? Images.DarkLogo : Images.LightLogo}
          height={34}
          width={140}
          sx={{ display: 'block' }}
        />
      </Box>

      {initiated && (
        <>
          {/* Desktop nav */}
          <Box
            sx={{ display: { xs: 'none', md: 'flex' } }}
            alignItems="center"
            columnGap={0.5}
          >
            {/* Go Pro badge for logged-in normal users */}
            {authenticated && session?.user.level === UserLevel.Normal && !AppMode.Free && (
              <Chip
                label="Go Pro"
                component="a"
                href="/prosignup"
                clickable
                size="small"
                sx={{
                  mr: 1,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  border: 'none',
                  px: 0.5,
                  '&:hover': { opacity: 0.9 },
                }}
              />
            )}

            {/* Nav items */}
            {menus
              .filter(
                (menu: IMenu) =>
                  (session?.user?.level != null && menu.level! <= session.user.level) ||
                  (!session?.user?.level && menu.level! === UserLevel.Normal),
              )
              .map((menu: IMenu, index: number) => (
                <Box key={index}>
                  {menu.href ? (
                    <Link
                      className="nav-link"
                      aria-describedby={menu.id}
                      href={menu.href}
                      sx={{ textDecoration: 'none' }}
                    >
                      {menu.icon && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 0.5,
                            color: hasActiveLink(menu.id)
                              ? 'primary.main'
                              : 'text.secondary',
                          }}
                        >
                          {menu.icon}
                        </Box>
                      )}
                      <Typography
                        component="span"
                        fontSize="0.875rem"
                        fontWeight={hasActiveLink(menu.id) ? 600 : 500}
                        color={hasActiveLink(menu.id) ? 'primary.main' : 'text.primary'}
                        sx={{ transition: 'color 0.15s' }}
                      >
                        {menu.title}
                      </Typography>
                    </Link>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      aria-describedby={menu.id}
                      sx={{
                        cursor: 'pointer',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        transition: 'background-color 0.15s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        },
                      }}
                      onClick={(e) => handleClick(e, menu.id)}
                    >
                      {menu.icon && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {menu.icon}
                        </Box>
                      )}
                      <Typography
                        component="span"
                        fontSize="0.875rem"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {menu.title}
                      </Typography>
                      {menu.pages && menu.pages.length > 0 && (
                        <ExpandMoreIcon
                          sx={{
                            ml: 0.25,
                            width: 16,
                            height: 16,
                            transform:
                              openedPopoverId === menu.id ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s',
                            color: 'text.secondary',
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              ))}

            {/* Unauthenticated CTAs */}
            {!authenticated && (
              <Box display="flex" alignItems="center" columnGap={1} ml={1}>
                <Button
                  variant="text"
                  href="/signin"
                  component="a"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 2,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.06),
                      transform: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  href="/signup"
                  component="a"
                  size="small"
                  sx={{ px: 2.5 }}
                >
                  Get Started Free
                </Button>
              </Box>
            )}

            <Box ml={1}>
              <ThemeToggler />
            </Box>
          </Box>

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems="center" gap={1}>
            <ThemeToggler />
            <IconButton
              onClick={() => onSidebarOpen()}
              aria-label="Menu"
              sx={{
                border: `1.5px solid ${alpha(theme.palette.divider, 0.5)}`,
                borderRadius: 2,
                p: 0.75,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )}

      {/* Dropdown Popover */}
      {openedPopoverId && anchorEl && (
        <Popover
          elevation={0}
          open={!!openedPopoverId}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            mt: 1.5,
            '.MuiPaper-root': {
              minWidth: 200,
              p: 1,
              mt: 1,
              borderRadius: 3,
              border: `1.5px solid ${alpha(theme.palette.divider, 0.6)}`,
              boxShadow: `0 16px 40px -8px ${alpha(theme.palette.primary.main, 0.12)}, 0 4px 12px -4px rgba(0,0,0,0.08)`,
              backdropFilter: 'blur(12px)',
            },
          }}
        >
          <Grid container spacing={0.5}>
            {menus
              .find((v) => v.id === openedPopoverId)
              ?.pages?.filter(
                (menu: IMenu) =>
                  menu.level! < UserLevel.Admin &&
                  ((session?.user.level != null && menu.level! <= session.user.level) ||
                    AppMode.Free),
              )
              .map((menu: IMenu, i: number) => (
                <Grid item key={i} xs={12}>
                  <Button
                    component="button"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: 2,
                      py: 0.75,
                      px: 1.5,
                      gap: 1,
                      fontSize: '0.875rem',
                      fontWeight: activeLink === menu.href ? 600 : 500,
                      color:
                        activeLink === menu.href
                          ? 'primary.main'
                          : 'text.primary',
                      backgroundColor:
                        activeLink === menu.href
                          ? alpha(theme.palette.primary.main, 0.08)
                          : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.06),
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                    onClick={() => handleSubMenuClick(menu)}
                  >
                    {menu.icon && (
                      <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                        {menu.icon}
                      </Box>
                    )}
                    {menu.title}
                    {menu.id === 'sign_out' && (
                      <Typography
                        component="span"
                        fontWeight={400}
                        fontSize="0.8rem"
                        color="text.secondary"
                        ml={0.25}
                      >
                        ({session?.user.user_name.split(' ')[0]})
                      </Typography>
                    )}
                  </Button>
                </Grid>
              ))}

            {openedPopoverId === 'profile' && session?.user.level === UserLevel.Admin && (
              <>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" px={1.5} pt={0.5} pb={0.25} gap={1}>
                    <Chip
                      label="Admin"
                      size="small"
                      color="secondary"
                      sx={{ fontSize: '0.68rem', height: 20, fontWeight: 700 }}
                    />
                    <Divider sx={{ flex: 1 }} />
                  </Box>
                </Grid>
                {menus
                  .find((v) => v.id === openedPopoverId)
                  ?.pages?.filter((menu: IMenu) => menu.level! === UserLevel.Admin)
                  .map((menu: IMenu, i: number) => (
                    menu.level! <= session?.user.level && (
                      <Grid item key={i} xs={12}>
                        <Button
                          component="button"
                          fullWidth
                          sx={{
                            justifyContent: 'flex-start',
                            borderRadius: 2,
                            py: 0.75,
                            px: 1.5,
                            gap: 1,
                            fontSize: '0.875rem',
                            fontWeight: activeLink === menu.href ? 600 : 500,
                            color:
                              activeLink === menu.href
                                ? 'primary.main'
                                : 'text.primary',
                            backgroundColor:
                              activeLink === menu.href
                                ? alpha(theme.palette.primary.main, 0.08)
                                : 'transparent',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.06),
                              transform: 'none',
                              boxShadow: 'none',
                            },
                          }}
                          onClick={() => handleSubMenuClick(menu)}
                        >
                          {menu.icon && (
                            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                              {menu.icon}
                            </Box>
                          )}
                          {menu.title}
                        </Button>
                      </Grid>
                    )
                  ))}
              </>
            )}
          </Grid>
        </Popover>
      )}
    </Box>
  );
};

export default Topbar;
