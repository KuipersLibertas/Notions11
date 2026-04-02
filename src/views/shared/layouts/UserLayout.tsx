import React, { useState, useEffect } from 'react';

import Container from '@/components/Container';

import {
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
} from '@mui/material';
import { ProfileSettingMenus as menus } from '@/layouts/Main/navigation';

export const UserLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [activeLink, setActiveLink] = useState('');
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : '');
  }, []);

  const handleMenuClick = (url: string|undefined): void => {
    if (!url) return;

    window.location.href = url;
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 207px)' }}>
      <Box bgcolor="primary.dark">
        <Container>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{ color: 'common.white' }}
          >
            Account settings
          </Typography>
          <Typography variant="h6" sx={{ color: 'common.white' }}>
            Change account information and settings
          </Typography>
        </Container>
      </Box>
      <Container paddingTop="0 !important" marginTop={-8}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <List
                disablePadding
                sx={{
                  display: { xs: 'inline-flex', md: 'flex' },
                  flexDirection: { xs: 'row', md: 'column' },
                  overflow: 'auto',
                  flexWrap: 'nowrap',
                  width: '100%',
                  paddingY: { xs: 3, md: 4 },
                  paddingX: { xs: 4, md: 0 },
                }}
              >
                {menus.map((menu, index) => (
                  <ListItem
                    key={index}
                    component="a"
                    disableGutters
                    sx={{
                      marginRight: { xs: 2, md: 0 },
                      flex: 0,
                      paddingX: { xs: 0, md: 3 },
                      borderLeft: {
                        xs: 'none',
                        md: '2px solid transparent',
                      },
                      borderLeftColor: {
                        md:
                          activeLink === menu.href
                            ? 'primary.dark'
                            : 'transparent',
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => handleMenuClick(menu.href)}
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                      color={
                        activeLink === menu.href
                          ? 'text.primary'
                          : 'text.secondary'
                      }
                    >
                      {menu.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Card sx={{ boxShadow: 3, padding: 4 }}>{children}</Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserLayout;