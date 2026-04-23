'use client';

import React, { useState } from 'react';
import * as yup from 'yup';
import UserLayout from '../../shared/layouts/UserLayout';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { CustomToastOptions } from '@/utils/constants';

interface IChangePasswordFormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = yup.object({
  currentPassword: yup.string().required('Current password is required').min(8, 'Minimum 8 characters'),
  newPassword: yup.string().required('New password is required').min(8, 'Minimum 8 characters'),
  confirmPassword: yup.string().required('Please confirm your new password').min(8, 'Minimum 8 characters'),
});

const ChangePassword = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues: IChangePasswordFormFields = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: IChangePasswordFormFields): Promise<void> => {
    if (isProcessing) return;

    if (values.newPassword !== values.confirmPassword) {
      formik.setFieldError('confirmPassword', "Passwords don't match");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/gateway/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const json = await response.json();
      if (json.success) {
        toast.success('Password changed successfully', CustomToastOptions);
        formik.resetForm();
      } else {
        toast.error(json.message || 'Failed to change password', CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const PasswordField = ({
    name,
    label,
    show,
    onToggle,
  }: {
    name: keyof IChangePasswordFormFields;
    label: string;
    show: boolean;
    onToggle: () => void;
  }) => (
    <TextField
      label={label}
      variant="outlined"
      name={name}
      type={show ? 'text' : 'password'}
      fullWidth
      value={formik.values[name]}
      onChange={formik.handleChange}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      // @ts-ignore
      helperText={formik.touched[name] && formik.errors[name]}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" onClick={onToggle} tabIndex={-1} edge="end">
              {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <UserLayout>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em" gutterBottom>
          Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a strong password with at least 8 characters.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box maxWidth={400}>
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <PasswordField
              name="currentPassword"
              label="Current Password"
              show={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
            />
            <PasswordField
              name="newPassword"
              label="New Password"
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm New Password"
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
            <LoadingButton
              size="large"
              variant="contained"
              type="submit"
              loading={isProcessing}
              sx={{ alignSelf: 'flex-start', px: 4 }}
            >
              Update Password
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </UserLayout>
  );
};

export default ChangePassword;
