'use client';

import React from 'react';
import HelpLayout from '@/views/shared/layouts/HelpLayout';

import { Box, IconButton, Link, Typography } from '@mui/material';
import { Images } from '@/utils/assets';
import { LinkedIn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from '@/utils/constants';


const AboutUs = (): JSX.Element => {
  const theme = useTheme();

  return (
    <HelpLayout title="About Us">
      <Box>
        <p>Hello and thank you for visiting Notions11!</p>
        <p>I have created Notions11 in 2023 as a Passdropit spin-off.  Passdropit was launched almost a decade ago (2014 to be exact) by an independent developer from Canada. He noticed that Dropbox and Google lacked the basic functionality of adding a password to your links and decided to build this feature himself. Passdropit soon became very popular amongst photographers around the world who share their digital presets securely with their own community. Meanwhile, over 35.000 users have created an account on Passdropit, securing well over 150.000 links!</p>
        <p>In 2022 Passdropit was acquired by me and right from the start I knew that similar functionality was needed for Notion links. With the help of a freelance developer I have created Notions11. The site is currently still in a beta phase and therefor it’s completely free to use. With a few clicks you can add a password to your Notion link and gain insight into who as accessed your content. Just try it and share your experience with me.  We are constantly working on improving Notions11 and introducing new features.</p>
        <p><br /></p>
        <p>If you like to reach out to us, or in need of technical support, you can contact us via contact@notions11.com or through our socials. We try to respond as quickly as possible.</p>
        <p><br /></p>
        <p>p.s. Have you watched Oceans 11 yet?  😉</p>
      </Box>
      <Box display="flex" alignItems="center" columnGap={1}>
        <Typography variant="subtitle1">Mail: </Typography>
        <Link href="mailto:contact@notions11.com">contact@notions11.com</Link>
      </Box>
      <Box mt={2}>
        <Box
          component="img"
          width={250}
          height={250}
          borderRadius="100%"
          src={Images.OwnerPhoto}
          alt="Robin Kuipers — Founder of Notions11"
        />
      </Box>
      <Box mt={1}>
        <Typography variant="h6" fontWeight={500}>Robin Kuipers</Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Linkedin </Typography>
        <IconButton
          href=" https://www.linkedin.com/in/robin-kuipers/"
          sx={{ ml: '-14px' }}
          target="_blank"
        >
          <LinkedIn
            sx={{
              width: 50,
              height: 50,
              color: theme.palette.mode === ThemeMode.light ? '#000' : '#fff'
            }}
          />
        </IconButton>
      </Box>
    </HelpLayout>
  );
};

export default AboutUs;