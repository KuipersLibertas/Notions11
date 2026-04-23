import React, { useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import {
  Box,
  Typography,
  TextField,
  Link,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import { CustomToastOptions } from '@/utils/constants';
import { alpha, useTheme } from '@mui/material/styles';

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required.'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'Minimum 8 characters'),
});

interface ILoginFormFields {
  email: string;
  password: string;
}

type SignFormProps = {
  onShowForgotPassword: () => void;
  onCallback: () => void;
};

const SignInForm = ({ onShowForgotPassword, onCallback }: SignFormProps): JSX.Element => {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const initialValues: ILoginFormFields = { email: '', password: '' };

  const onSubmit = async (values: ILoginFormFields): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);

    signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    }).then((res) => {
      setIsProcessing(false);
      if (res?.ok) {
        onCallback();
      } else {
        toast.error('Incorrect email or password', CustomToastOptions);
      }
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <>
      {/* Header */}
      <Box mb={3.5}>
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing="-0.02em"
          gutterBottom
        >
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your Notions11 account to continue.
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
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
                  <EmailOutlined
                    fontSize="small"
                    sx={{ color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0.75}
            >
              <Typography variant="body2" fontWeight={500}>
                Password
              </Typography>
              <Link
                component="button"
                type="button"
                onClick={onShowForgotPassword}
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Link>
            </Box>
            <TextField
              variant="outlined"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              // @ts-ignore
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <LoadingButton
            size="large"
            variant="contained"
            type="submit"
            loading={isProcessing}
            fullWidth
            sx={{ mt: 0.5, py: 1.4 }}
          >
            Sign In
          </LoadingButton>
        </Box>
      </form>

      <Divider sx={{ my: 2.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          OR
        </Typography>
      </Divider>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Create a free account
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default SignInForm;
