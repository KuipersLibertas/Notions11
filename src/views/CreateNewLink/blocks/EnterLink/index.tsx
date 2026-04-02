import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { KeyboardDoubleArrowRight } from '@mui/icons-material';
import { IChooseLink, IValidationError } from '@/types';
import { generateLink, generatePassword } from '@/utils/functions';

type EnterLinkProps = {
  onEntered: (data: IChooseLink) => void,
}

const EnterLink = ({ onEntered }: EnterLinkProps): JSX.Element => {
  const [link, setLink] = useState<string>('');
  const [error, setError] = useState<IValidationError|null>(null);

  const handleChooseFolder = () => {
    if (link.trim() === '') {
      setError({
        link: {
          message: 'Please enter valid link'
        }
      });
      return;
    }

    if (!link.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.notion.(site|so)\/[-a-zA-Z0-9@:%._+~#=]+/gm)) {
      setError({
        link: {
          message: 'Please enter valid link'
        }
      });
      return;
    }

    setError(null);

    const data: IChooseLink = {
      link: generateLink(),
      service: 3,
      password: generatePassword(),
      files: [
        {
          url: link,
        }
      ]
    };

    onEntered(data);
  };

  return (
    <Box>
      <Box py={2}>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center">
        Paste a Notion link to share it&apos;s content
        </Typography>
      </Box>
      <Box
        maxWidth={600}
        mx="auto"
        mt={2}
      >
        <TextField
          variant="outlined"
          label="Paste Notion link"
          fullWidth
          onChange={(e) => setLink(e.target.value)}
          value={link}
          error={!!error?.link}
          helperText={error?.link?.message}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        mt={4}
        mx="auto"
        maxWidth={600}
      >
        <LoadingButton
          variant="contained"
          onClick={handleChooseFolder}
          sx={{ px: 4 }}
        >
          Next
          <KeyboardDoubleArrowRight fontSize="medium" />
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default EnterLink;