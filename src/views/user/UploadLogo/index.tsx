'use client';

import React, { useState, useRef } from 'react';
import UserLayout from '@/views/shared/layouts/UserLayout';

import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  Delete as DeleteIcon,
  Face5
} from '@mui/icons-material';
import { uploadLogo, deleteLogo } from '@/api';
import { CustomToastOptions } from '@/utils/constants';
import { useSession } from 'next-auth/react';

const UploadLogo = (): JSX.Element => {
  const fileRef = useRef<HTMLInputElement|null>(null);
  const { data: session, update } = useSession();

  const [isUploadProcessing, setIsUploadProcessing] = useState<boolean>();
  const [isDeleteProcessing, setIsDeleteProcessing] = useState<boolean>();
  
  const handleDelete = ():  void => {
    if (isDeleteProcessing) return;

    setIsDeleteProcessing(true);

    deleteLogo()
      .then(response => {
        setIsDeleteProcessing(false);
        if (response.success) {
          toast.success('The logo is deleted successfully.', CustomToastOptions);
          const data = {
            ...session,
            user: {
              ...session?.user,
              logo: ''
            }
          };

          update(data);
        } else {
          toast.error(response.message, CustomToastOptions);
        }
      })
      .catch(error => {
        setIsDeleteProcessing(false);
        toast.error(error.message, CustomToastOptions);
      });
  };

  const handleUpload = (): void => {
    
    if (isUploadProcessing) return;

    if (!fileRef.current)
      return;

    fileRef.current.click();
  };

  const handleUploadProcess = (): void => {
    if (isUploadProcessing) return;

    setIsUploadProcessing(true);
    const formData = new FormData();
    if (fileRef.current?.files?.length && fileRef.current?.files?.length > 0)
      formData.append('logo', fileRef.current?.files[0]);
    else
      return;

    uploadLogo(formData)
      .then(response => {
        setIsUploadProcessing(false);
        if (response.success) {
          toast.success('The logo is uploaded successfully.', CustomToastOptions);
          const data = {
            ...session,
            user: {
              ...session?.user,
              logo: response.file
            }
          };

          update(data);
        } else {
          toast.error(response.message, CustomToastOptions);
        }
      })
      .catch(error => {
        setIsUploadProcessing(false);
        toast.error(error.message, CustomToastOptions);
      });
  };

  return (
    <UserLayout>
      <Box mb="2rem">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Upload Logo
        </Typography>
      </Box>
      <Divider />
      <Box mt="2rem">
        <Box maxWidth={400} marginTop="1rem" display="flex" flexDirection="column" alignItems="center">
          {session?.user.logo&&
            <Box
              component="img"
              height={1}
              width={1}
              src={session?.user.logo}
              alt="..."
              loading="lazy"
            />
          }
          {!session?.user.logo&&
            <Face5
              sx={{
                width: '256px',
                height: '256px',
                opacity: '.5',
              }}
            />
          }
          <Box display="flex" columnGap="1rem" py="3rem" justifyContent="center">
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleUploadProcess} accept="image/*" />
            <LoadingButton
              variant="contained"
              color="primary"
              loading={isUploadProcessing}
              onClick={handleUpload}
            >
              <FileUploadIcon />
              Upload
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="error"
              loading={isDeleteProcessing}
              onClick={handleDelete}
            >
              <DeleteIcon />
              Delete
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </UserLayout>
  );
};

export default UploadLogo;