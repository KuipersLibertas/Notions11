'use client';

import React, { useState, useCallback } from 'react';
import Container from '@/components/Container';
import ValidationCheckForm from '@/views/Download/blocks/ValidationCheckForm';
import SharedFiles from '@/views/Download/blocks/SharedFiles';

import {
  Box,
} from '@mui/material';
import { IServerLinkDetail } from '@/types';
import { Face5 } from '@mui/icons-material';

const Download = ({ linkInfo }: { linkInfo: IServerLinkDetail }): JSX.Element => {
  const [isValidated, setIsValidated] = useState<boolean>(linkInfo.ignoreValidate);

  const handleValidationResult = useCallback((result: boolean): void => {
    setIsValidated(result);
  }, []);

  return (
    <Container maxWidth={800}>
      <Box
        display="flex"
        justifyContent="center"
      >
        {linkInfo.ownerLogo
          ?
          <Box
            component="img"
            src={linkInfo.ownerLogo}
            width={256}
            alt=""
          />
          :
          // <Image
          //   src={theme.palette.mode === ThemeMode.dark ? Images.LightLogo : Images.DarkLogo}
          //   width={345}
          //   height={45}
          //   alt=""
          // />
          <Face5
            sx={{
              width: '256px',
              height: '256px',
              opacity: '.5',
            }}
          />
        }
        
      </Box>
      <Box
        component="main"
      >
        <Box px="5rem" py="3rem">
          {(!isValidated && !linkInfo.requirePaid) ? (
            <ValidationCheckForm
              linkInfo={linkInfo}
              onValidationResult={handleValidationResult}              
            />
          ) : (
            <SharedFiles linkInfo={linkInfo} />
          )}
        </Box>
      </Box>
    </Container>
    
  );
};

export default Download;