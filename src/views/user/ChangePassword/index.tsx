'use client';

import React, { useState } from 'react';
import * as yup from 'yup';
import UserLayout from '../../shared/layouts/UserLayout';

import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CustomToastOptions } from '@/utils/constants';

interface IChangePasswordFormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8'),
  newPassword: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8'),
  confirmPassword: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8'),
});

const ChangePassword = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const initialValues: IChangePasswordFormFields = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: IChangePasswordFormFields): Promise<void> => {
    if (isProcessing) return;

    if (values.newPassword !== values.confirmPassword) {
      formik.touched.confirmPassword = true;
      formik.errors.confirmPassword = 'The confirm password doesn\'t match new password';
      return;
    }
    setIsProcessing(true);

    const data = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    };
    
    try {
      const response = await fetch(
        '/api/gateway/change-password',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );

      const json = await response.json();
      if (json.success) {
        toast.success('The password is changed successfully', CustomToastOptions);
      } else {
        toast.success(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  return (
    <UserLayout>
      <Box mb="2rem">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Reset Password
        </Typography>
        <Typography color="text.secondary" mt="0.5rem">
          Fill out the fields of the form below.
        </Typography>
      </Box>
      <Divider />
      <Box maxWidth="30rem" mt="2rem">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                label="Current Password *"
                variant="outlined"
                name="currentPassword"
                type="password"
                fullWidth
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                // @ts-ignore
                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Password *"
                variant="outlined"
                name="newPassword"
                type="password"
                fullWidth
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                // @ts-ignore
                helperText={formik.touched.newPassword && formik.errors.newPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password *"
                variant="outlined"
                name="confirmPassword"
                type="password"
                fullWidth
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                // @ts-ignore
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
            <Grid item container xs={12}>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                loading={isProcessing}
              >
                Reset Password
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </UserLayout>
  );
};

export default ChangePassword;