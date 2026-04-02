'use client';

import React from 'react';
import moment from 'moment';
import CommonLayout from '@/views/shared/layouts/CommonLayout';
import {
  Box,
  Grid,
  Typography,
  CardMedia,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IPost } from '@/types';

const BlogOverview = ({ postList }: { postList: IPost[] }): JSX.Element => {
  const theme = useTheme();

  return (
    <CommonLayout title="Blog Posts">
      <Grid container spacing={4} sx={{ pb: '3rem' }}>
        {postList.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i} >
            <Box
              component="a"
              href={`/blog/${item.slug}`}
              display="block"
              width={1}
              height={1}
              sx={{
                textDecoration: 'none',
                transition: 'all .2s ease-in-out',
                '&:hover': {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box
                component={Card}
                width={1}
                height={1}
                boxShadow={4}
                display="flex"
                flexDirection="column"
                sx={{ backgroundImage: 'none' }}
              >
                <CardMedia
                  image={item.feature_image}
                  title={item.title}
                  sx={{
                    height: { xs: 200, md: 260 },
                    position: 'relative',
                  }}
                >
                  <Box
                    component={'svg'}
                    viewBox="0 0 2880 480"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      color: theme.palette.background.paper,
                      transform: 'scale(2)',
                      height: 'auto',
                      width: 1,
                      transformOrigin: 'top center',
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2160 0C1440 240 720 240 720 240H0v240h2880V0h-720z"
                      fill="currentColor"
                    />
                  </Box>
                </CardMedia>
                <Box component={CardContent} position="relative">
                  <Typography variant={'h6'} gutterBottom>
                    {item.title}
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Box padding={2} pt={0} display="flex" flexDirection="column">
                  <Box marginBottom={2}>
                    <Divider />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{ marginRight: 1 }}
                      />
                      <Typography color="text.secondary">
                        {item.primary_author.name}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary">
                      {moment(item.created_at).format('DD-MM-YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CommonLayout>
  );
};

export default BlogOverview;