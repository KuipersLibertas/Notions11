import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { IChooseLink } from '@/types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  Add as AddIcon,
  List as ListIcon
} from '@mui/icons-material';
import { CustomToastOptions } from '@/utils/constants';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

type ChooseResultProps = {
  linkInfo: IChooseLink
}

const ChooseResult = ({ linkInfo }: ChooseResultProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();
  const [visibleFeedback, setVisibleFeedback] = useState<boolean>(true);

  const isMdScreen = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`URL: ${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/${linkInfo.link}\nPassword: ${linkInfo.password}`);
    toast.success('Successfully copied URL and Password! ', CustomToastOptions);
  };

  return (
    <Box minWidth={750} mx="auto">
      {(session?.user && visibleFeedback)&&
        <Alert severity="success" onClose={() => setVisibleFeedback(false)}>
          Success! Your Notions11 link has been saved. You can manage it, share it, copy/paste the URL and Password below.
        </Alert>
      }
      {(!session?.user && visibleFeedback)&&
        <Alert severity="warning" onClose={() => setVisibleFeedback(false)}>
          Careful! This info can&apos;t be retrieved once you leave this page. Copy it below, or <strong>Create a free account</strong> to save and manage your Passdrops.
        </Alert>
      }
      <Box
        component={Card}
        height={1}
        display="flex"
        flexDirection="column"
        variant="elevation"
        mt={2}
      >
        <CardContent
          sx={{
            padding: 4,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={500}
              textAlign={{ xs: 'center', sm: 'left' }}
            >
              Copy your Notions11 link and password
            </Typography>
          </Box>
          <Box mt={5}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign={{ xs: 'center', sm: 'left' }}
            >
              URL: {process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/{linkInfo.link}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              textAlign={{ xs: 'center', sm: 'left' }}
            >
              Password: {linkInfo.password}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
            columnGap={1}
            rowGap={1}
            mt={5}
          >
            <Button
              variant="contained"
              fullWidth={isMdScreen ? false : true}              
              onClick={() => handleCopy()}
            >
              <ContentCopyIcon />&nbsp;
              Copy URL and Password
            </Button>
            <Button
              variant="outlined"
              color="warning"
              fullWidth={isMdScreen ? false : true}
              component="a"
              href={`mailto:?subject=Here is a Notions11 link&body=%0A%0AHere is a link to download your file: ${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}/${linkInfo.link} %0A%0A And here is the password: ${linkInfo.password} %0A%0A---%0ASent via Notions11 (${process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}), password protection for your Notions links.`}
            >
              <ShareIcon />&nbsp;
              Share
            </Button>
            <Button
              variant="outlined"
              color="warning"
              fullWidth={isMdScreen ? false : true}
              component="a"
              href={`/${linkInfo.link}`}
              target="_blank"
            >
              <VisibilityIcon />&nbsp;
              Preview
            </Button>
            <Button
              variant="outlined"
              color="warning"
              fullWidth={isMdScreen ? false : true}
              component="a"
              href="/create-new-link/file"
            >
              <AddIcon />&nbsp;
              New
            </Button>
            <Button
              variant="outlined"
              color="warning"
              fullWidth={isMdScreen ? false : true}
              component="a"
              href="/manage-link"
            >
              <ListIcon />&nbsp;
              Manage
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );
};

export default ChooseResult;