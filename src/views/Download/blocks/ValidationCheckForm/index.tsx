'use client';

import React, { useState } from 'react';
import * as yup from 'yup';

import { useFormik } from 'formik';
import {
  Box, TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { validateLink } from '@/api';
import { IServerLinkDetail } from '@/types';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

type ValidationCheckFormProps = {
  onValidationResult: (result: boolean) => void,
  linkInfo: IServerLinkDetail
}

interface IValidationFormFields {
  password: string;
}

const validationSchema = yup.object({
  password: yup
    .string()
    .required('Please enter a password')
});

const ValidationCheckForm = ({ linkInfo, onValidationResult }: ValidationCheckFormProps): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>();

  const initialValues: IValidationFormFields = {
    password: ''
  };

  const onSubmit = async (values: IValidationFormFields): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    validateLink(linkInfo.id, values.password)
      .then(response => {
        setIsProcessing(false);
        if (response.success) {
          onValidationResult(true);
        } else {
          toast.error(response.message, CustomToastOptions);
        }
      })
      .catch(error => {
        setIsProcessing(false);
        toast.error(error.message, CustomToastOptions);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          InputProps={{
            endAdornment: <LoadingButton type="submit" variant="contained" loading={isProcessing}>Go!</LoadingButton>,
          }}
          type="password"
          variant="outlined"
          name="password"          
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          // @ts-ignore
          helperText={formik.touched.password && formik.errors.password}
        />
      </form>
    </Box>
  );
};

export default ValidationCheckForm;