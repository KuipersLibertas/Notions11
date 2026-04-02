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
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { AppMode, ThemeMode, UserLevel } from '@/utils/constants';
import { Images } from '@/utils/assets';
import { IMenu } from '@/layouts/Main/navigation';
import { TwitterIcon } from '@/utils/icons';
import { signOut, useSession } from 'next-auth/react';

type TopbarProps = {
  menus: IMenu[],
  onSidebarOpen: () => void,
};

const Topbar = ({
  menus,
  onSidebarOpen
}: TopbarProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();

  const { mode : themeMode } = theme.palette;
  const { authenticated } = useContext(ApplicationContext);

  const [activeLink, setActiveLink] = useState('');
  const [anchorEl, setAnchorEl] = useState<Element>();
  const [openedPopoverId, setOpenedPopoverId] = useState<string|null>(null);
  const [initiated, setInitiated] = useState<boolean>(false);

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');

    if (initiated) return;

    setInitiated(true);
  }, []);

  const hasActiveLink = (key: string): boolean => {
    const menu = menus.find(v => v.id === key);
    if (menu) {
      return menu.href === activeLink;
    }
    
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

      signOut({ redirect: false })
        .then(() => {
          window.location.href = '/';
        });
      
    } else {
      window.location.href = menu.href!;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width={1}
    >
      <Box
        display="flex"
        component="a"
        href="/"
        title=""
        width={{ xs: 140 }}
      >
        <Box
          component="img"
          src={
            themeMode === ThemeMode.light
              ? Images.DarkLogo
              : Images.LightLogo
          }
          height={18}
          width={74}
        />
      </Box>
      {initiated&&
        <>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems="center">
            {!authenticated&&
              <Box display="flex" columnGap={1}>
                <IconButton href="https://twitter.com/Notions_11">
                  <TwitterIcon color={theme.palette.text.primary} />
                </IconButton>
              </Box>
            }
            {(authenticated && session?.user.level === UserLevel.Normal && !AppMode.Free)&&
              <Button
                variant="contained"
                color="error"
                href="/prosignup"
                sx={{ mr: 2 }}
              >
              Go Pro!
              </Button>
            }
            {menus.filter((menu: IMenu) => ((session?.user?.level && menu.level! <= session?.user?.level) || (!session?.user?.level && menu.level! === UserLevel.Normal))).map((menu: IMenu, index: number) =>
              <Box key={index}>
                {menu.href ? (
                  <Link className="nav-link" aria-describedby={menu.id} href={menu.href}>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      {menu.icon&& menu.icon}
                    </Typography>
                    <Typography
                      component="span"
                      fontWeight={hasActiveLink(menu.id) ? 700 : 400}
                      color="text.primary"
                    >
                      {menu.title}
                    </Typography>
                  </Link>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    aria-describedby={menu.id}
                    sx={{ cursor: 'pointer', px: 1.5 }}
                    onClick={(e) => handleClick(e, menu.id)}
                  >
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      {menu.icon&& menu.icon}
                    </Typography>
                    <Typography
                      component="span"  
                      fontWeight={hasActiveLink(menu.id) ? 700 : 400}
                      color="text.primary"
                    > 
                      {menu.title}
                    </Typography>
                    {(menu.pages && menu.pages.length > 0)&&
                      <ExpandMoreIcon
                        sx={{
                          marginLeft: theme.spacing(1 / 4),
                          width: 16,
                          height: 16,
                          transform: openedPopoverId === menu.id ? 'rotate(180deg)' : 'none',
                          color: 'text.primary',
                        }}
                      />
                    }
                  </Box>
                )}
              </Box>
            )}
            <Box marginLeft={4}>
              <ThemeToggler />
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }} alignItems="center">
            <Button
              onClick={() => onSidebarOpen()}
              aria-label="Menu"
              variant="outlined"
              sx={{
                borderRadius: 2,
                minWidth: 'auto',
                padding: 1,
                borderColor: alpha(theme.palette.divider, 0.2),
              }}
            >
              <MenuIcon />
            </Button>
          </Box>
        </>
      }
      
      {(openedPopoverId && anchorEl)&&
        <Popover
          elevation={3}
          open={!!openedPopoverId}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{
            '.MuiPaper-root': {
              maxWidth: 250,
              padding: 2,
              marginTop: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              borderTop: `3px solid ${theme.palette.primary.main}`,
            },
          }}
        >
          <Grid container spacing={0.5}>
            {menus
              .find(v => v.id === openedPopoverId)?.pages?.filter(
                (menu: IMenu) => menu.level! < UserLevel.Admin && ((session?.user.level != undefined && menu.level! <= session?.user.level) || AppMode.Free)
              )
              .map((menu: IMenu, i: number) => (
                <Grid item key={i} xs={12}>
                  <Button
                    component="button"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      color:
                        activeLink === menu.href
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                      backgroundColor:
                        activeLink === menu.href
                          ? alpha(theme.palette.primary.main, 0.1)
                          : 'transparent',
                      fontWeight: activeLink === menu.href ? 600 : 400,
                      columnGap: '5px',
                    }}
                    onClick={() => handleSubMenuClick(menu)}
                  >
                    {menu.icon&& menu.icon}
                    {menu.title}
                    {menu.id === 'sign_out'&&                                  
                      <Typography
                        component="span"  
                        fontWeight={400}
                        color="text.secondary"
                      >
                        &nbsp;({session?.user.user_name.split(' ')[0]})
                      </Typography>
                    }
                  </Button>
                </Grid>              
              ))
            }
            {(openedPopoverId === 'profile' && session?.user.level === UserLevel.Admin)&&
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  columnGap={1}
                  width={1}
                  px={1.5} 
                >
                  <Typography
                    component="span"
                    color="primary.main"
                    fontSize={10}
                  >
                    Super User
                  </Typography>
                  <Divider component="p" sx={{ width: 0.6 }} />
                </Box>                
                {menus
                  .find(v => v.id === openedPopoverId)?.pages?.filter((menu: IMenu) => menu.level! === UserLevel.Admin)
                  .map((menu: IMenu, i: number) => (
                    menu.level! <= session?.user.level&&
                      <Grid item key={i} xs={12}>
                        <Button
                          component='button'
                          fullWidth
                          sx={{
                            justifyContent: 'flex-start',
                            color:
                              activeLink === menu.href
                                ? theme.palette.primary.main
                                : theme.palette.text.primary,
                            backgroundColor:
                              activeLink === menu.href
                                ? alpha(theme.palette.primary.main, 0.1)
                                : 'transparent',
                            fontWeight: activeLink === menu.href ? 600 : 400,
                            columnGap: '5px',
                          }}
                          onClick={() => handleSubMenuClick(menu)}
                        >
                          {menu.icon&& menu.icon}
                          {menu.title}
                        </Button>
                      </Grid>              
                  ))}
              </>
            }
          </Grid>
        </Popover>
      }
    </Box>
  );
};

export default Topbar;