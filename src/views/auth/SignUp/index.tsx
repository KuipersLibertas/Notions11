'use client';

import React, { useState } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  PersonOutlined,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { signUp } from '@/api';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

interface ISignUpFormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = yup.object({
  firstName: yup.string().trim().min(2).max(50).required('First name is required'),
  lastName: yup.string().trim().min(2).max(50).required('Last name is required'),
  email: yup.string().trim().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Minimum 8 characters'),
  confirmPassword: yup.string().required('Please confirm your password').min(8, 'Minimum 8 characters'),
});

const SignUp = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const isLight = theme.palette.mode === 'light';

  const initialValues: ISignUpFormFields = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = async (values: ISignUpFormFields): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);
    signUp({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    })
      .then((response) => {
        setIsProcessing(false);
        if (response.success) {
          toast.success('Account created! Please sign in.', CustomToastOptions);
          router.push('/signin');
        } else {
          toast.error(response.message, CustomToastOptions);
        }
      })
      .catch((error) => {
        setIsProcessing(false);
        toast.error(error.message, CustomToastOptions);
      });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh - 68px)"
      sx={{
        background: isLight
          ? 'linear-gradient(160deg, #f0f7ff 0%, #ffffff 40%, #f5f0ff 100%)'
          : 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        px: 2,
        py: 4,
      }}
    >
      {/* Background blobs */}
      <Box
        sx={{
          position: 'fixed',
          top: '5%',
          right: '8%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isLight ? 0.08 : 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '5%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, isLight ? 0.06 : 0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: `1.5px solid ${alpha(theme.palette.divider, isLight ? 0.8 : 0.4)}`,
          boxShadow: isLight
            ? `0 20px 60px -12px ${alpha(theme.palette.primary.main, 0.12)}, 0 8px 24px -8px rgba(0,0,0,0.06)`
            : `0 20px 60px -12px rgba(0,0,0,0.4)`,
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box mb={3.5}>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Free forever. No credit card required.
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First name"
                variant="outlined"
                name="firstName"
                fullWidth
                autoComplete="given-name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                // @ts-ignore
                helperText={formik.touched.firstName && formik.errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last name"
                variant="outlined"
                name="lastName"
                fullWidth
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                // @ts-ignore
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email address"
                variant="outlined"
                name="email"
                type="email"
                fullWidth
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                // @ts-ignore
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                // @ts-ignore
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm password"
                variant="outlined"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                fullWidth
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                // @ts-ignore
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                loading={isProcessing}
                fullWidth
                sx={{ py: 1.4 }}
              >
                Create Account
              </LoadingButton>
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ my: 2.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>OR</Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              href="/signin"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign in
            </Link>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
            By signing up, you agree to our{' '}
            <Link href="/terms-of-service" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
              Privacy Policy
            </Link>.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp;
