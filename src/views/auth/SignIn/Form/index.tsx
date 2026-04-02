import React, { useState } from 'react';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { signIn } from 'next-auth/react';
import { CustomToastOptions } from '@/utils/constants';

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required.'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8'),
});

interface ILoginFormFields {
  email: string;
  password: string;
}

type SignFormProps = {
  onShowForgotPassword: () => void,
  onCallback: () => void,
}

const SignInForm = ({ onShowForgotPassword, onCallback }: SignFormProps): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const initialValues: ILoginFormFields = {
    email: '',
    password: '',
  };

  const onSubmit = async (values: ILoginFormFields): Promise<void> => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password
    })
      .then((res) => {
        setIsProcessing(false);

        if (res?.ok) {
          onCallback();
        } else {
          toast.error('You are failed to login', CustomToastOptions);
        }
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  const handleForgotPassword = (): void => {
    onShowForgotPassword();
  };

  return (
    <>
      <Box marginBottom={4}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Sign In
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Login to Notions11.
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email *"
              variant="outlined"
              name="email"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              // @ts-ignore
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent={'flex-end'}
              width={1}
              marginBottom={2}
            >
              <Typography variant="subtitle2">
                <Button
                  component="a"
                  color="primary"
                  onClick={handleForgotPassword}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'transparent',
                    }
                  }}
                >
                  Forgot your password?
                </Button>
              </Typography>
            </Box>
            <TextField
              label="Password *"
              variant="outlined"
              name="password"
              type="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              // @ts-ignore
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item container xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent="space-between"
              width={1}
              maxWidth={600}
              margin="0 auto"
            >
              <Box marginBottom={{ xs: 1, sm: 0 }}>
                <Typography variant="subtitle2">
                  Don&apos;t have an account yet?{' '}
                  <Link
                    href="/signup"
                    className="link"
                  >
                    Sign up here.
                  </Link>
                </Typography>
              </Box>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                loading={isProcessing}
              >
                Login
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>      
    </>
  );

};

export default SignInForm;