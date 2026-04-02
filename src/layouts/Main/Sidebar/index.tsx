import React from 'react';
import ThemeToggler from '@/components/ThemeToggler';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { AppMode, ThemeMode, UserLevel } from '@/utils/constants';
import { Images } from '@/utils/assets';
import { IMenu } from '@/layouts/Main/navigation';
import { signOut, useSession } from 'next-auth/react';

type SidebarProps = {
  onClose: () => void,
  open: boolean,
  variant: 'permanent' | 'persistent' | 'temporary' | undefined,
  menus: IMenu[]
};
const Sidebar = ({
  onClose,
  open,
  variant,
  menus
}: SidebarProps): JSX.Element => {
  const theme = useTheme();

  const { data: session } = useSession();
  const { mode: themeMode } = theme.palette;

  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  const hasActiveLink = (key: string): boolean => {
    const menu = menus.find(v => v.id === key);
    if (menu) {
      return menu.href === activeLink;
    }
    return false;
  };

  const handleSubMenuClick = async (menu: IMenu): Promise<void> => {
    if (menu.id === 'sign_out') {
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
    <Drawer
      anchor="left"
      onClose={() => onClose()}
      open={open}
      variant={variant}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: 280,
        },
      }}
    >
      <Box        
        sx={{
          height: '100%',
          padding: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width={1}
          paddingX={2}
          paddingY={1}
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
              width={1}
              height="auto"
            />
          </Box>
          <Box>
            <ThemeToggler />
          </Box>
        </Box>
        <Box paddingX={2} paddingY={2}>
          {menus.map((menu: IMenu, index: number) =>
            <Box key={index}>
              {(menu.pages && menu.pages.length > 0) ? (
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ padding: 0 }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography
                      component="span"
                      fontWeight={hasActiveLink(menu.id) ? 600 : 400}
                      color={hasActiveLink(menu.id) ? 'primary' : 'text.primary'}
                    >
                      {menu.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <Grid container spacing={1}>
                      {menu.pages
                        .filter(
                          menu => menu.level! < UserLevel.Admin && ((session?.user.level != undefined && menu.level! <= session?.user.level) || AppMode.Free)
                        )
                        .map((menu, i) => (
                          <Grid item key={i} xs={12}>
                            <Button
                              size={'large'}
                              component={'a'}
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
                              }}
                              onClick={() => handleSubMenuClick(menu)}
                            >
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
                      {(menu.id === 'profile' && session?.user.level === UserLevel.Admin)&&
                        <>
                          <Grid item xs={12} display="flex" columnGap={1} alignItems="center">
                            <Typography
                              component="span"
                              color="primary.main"
                              fontSize={10}
                              px={1.5} 
                            >
                              Super User
                            </Typography>
                            <Divider component="p" sx={{ width: 0.6 }} />
                          </Grid>
                          {menu.pages
                            .filter(menu => menu.level! === UserLevel.Admin)
                            .map((menu, i) => (
                              <Grid item key={i} xs={12}>
                                <Button
                                  size={'large'}
                                  component={'a'}
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
                                  }}
                                  onClick={() => handleSubMenuClick(menu)}
                                >
                                  {menu.title}
                                </Button>
                              </Grid>
                            ))
                          }
                        </>
                      }
                      
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Accordion
                  disableGutters
                  elevation={0}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ padding: 0 }}
                  >
                    <Button
                      component="a"
                      href={menu.href}
                      sx={{
                        width: 1,
                        justifyContent: 'flex-start',
                        px: 0,
                      }}
                    >
                      <Typography
                        component="span"
                        fontWeight={hasActiveLink(menu.id) ? 600 : 400}
                        color={hasActiveLink(menu.id) ? 'primary' : 'text.primary'}
                      >
                        {menu.title}
                      </Typography>
                    </Button>
                  </AccordionSummary>
                </Accordion>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;