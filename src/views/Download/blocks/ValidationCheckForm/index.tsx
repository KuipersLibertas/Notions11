'use client';

import React, { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateLink } from '@/api';
import { IServerLinkDetail } from '@/types';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

type ValidationCheckFormProps = {
  onValidationResult: (result: boolean) => void;
  linkInfo: IServerLinkDetail;
};

const validationSchema = yup.object({
  password: yup.string().required('Please enter the password'),
});

const ValidationCheckForm = ({ linkInfo, onValidationResult }: ValidationCheckFormProps): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (values: { password: string }): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);
    validateLink(linkInfo.id, values.password)
      .then((response) => {
        setIsProcessing(false);
        if (response.success) {
          onValidationResult(true);
        } else {
          toast.error(response.message, CustomToastOptions);
        }
      })
      .catch((error) => {
        setIsProcessing(false);
        toast.error(error.message, CustomToastOptions);
      });
  };

  const formik = useFormik({ initialValues: { password: '' }, validationSchema, onSubmit });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            name="password"
            autoFocus
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            // @ts-ignore
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isProcessing}
            fullWidth
            size="large"
            sx={{ py: 1.4 }}
          >
            Unlock Link
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default ValidationCheckForm;
