'use client';

import React, { useState, useCallback } from 'react';
import CommonLayout from '@/views/shared/layouts/CommonLayout';
import GenerateUrlPwd from '@/views/CreateNewLink/blocks/GenerateUrlPwd';
import ChooseResult from '@/views/CreateNewLink/blocks/ChooseResult';
import EnterLink from '@/views/CreateNewLink/blocks/EnterLink';
import {
  Box,
  Typography
} from '@mui/material';
import { IChooseLink } from '@/types';

const CreateNewLink = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [chooseLink, setChooseLink] = useState<IChooseLink>();
  
  const handleEnterLink = useCallback((data: IChooseLink): void => {
    if (data.files.length === 0) return;
    
    setChooseLink(data);
    setCurrentStep(2);
  }, []);

  const handleSaveLink = useCallback((link: string, password: string): void => {
    const data = { ...chooseLink, link: link, password: password };
    setChooseLink(data as IChooseLink);
    setCurrentStep(3);
  }, []);

  return (
    <CommonLayout title="Create New Link">
      <Box maxWidth={900} mt="1rem" mx="auto">
        {currentStep !== 3&&
          <Typography variant="h5" textAlign="center">
            Password Protect Notion
          </Typography>
        }
        {currentStep === 1&&
          <EnterLink onEntered={handleEnterLink} />
        }
        {(currentStep === 2 && chooseLink)&&
          <GenerateUrlPwd linkInfo={chooseLink} onSave={handleSaveLink} />
        }
        {(currentStep === 3 && chooseLink)&&
          <ChooseResult linkInfo={chooseLink}/>
        }
      </Box>
    </CommonLayout>
  );
};

export default CreateNewLink;