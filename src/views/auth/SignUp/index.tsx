'use client';

import React, { useState } from 'react';
import * as yup from 'yup';
import Container from '@/components/Container';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
  firstName: yup
    .string()
    .trim()
    .min(2, 'Please enter a valid name')
    .max(50, 'Please enter a valid name')
    .required('Please enter your first name'),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Please enter a valid name')
    .max(50, 'Please enter a valid name')
    .required('Please enter your last name'),
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8'),
  confirmPassword: yup
    .string()
    .required('Please enter your password')
    .min(8, 'The password should have at minimum length of 8')
});

const SignUp = (): JSX.Element => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const initialValues: ISignUpFormFields = {    
    firstName: '', 
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const onSubmit = async(values: ISignUpFormFields): Promise<void> => {
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
          toast.success('Successfully registered', CustomToastOptions);
          router.push('/signin');
        } else {
          const { message } = response;
          toast.error(message, CustomToastOptions);
        }        
      })
      .catch(error => {
        setIsProcessing(false);

        toast.error(error.message, CustomToastOptions);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  return (
    <Container sx={{ maxWidth: '40rem', minHeight: 'calc(100vh - 207px)' }}>
      <Box marginBottom={4}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Sign Up
        </Typography>
        <Typography color="text.secondary">
          Fill out the form to get started.
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First name *"
              variant="outlined"
              name={'firstName'}
              fullWidth
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              // @ts-ignore
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last name *"
              variant="outlined"
              name={'lastName'}
              fullWidth
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              // @ts-ignore
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email *"
              variant="outlined"
              name={'email'}
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              // @ts-ignore
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password *"
              variant="outlined"
              name={'password'}
              type={'password'}
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              // @ts-ignore
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password *"
              variant="outlined"
              name={'confirmPassword'}
              type={'password'}
              fullWidth
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              // @ts-ignore
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Grid>
          <Grid item container xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretched', sm: 'center' }}
              justifyContent={'space-between'}
              width={1}
              maxWidth={600}
              margin={'0 auto'}
            >
              <Box marginBottom={{ xs: 1, sm: 0 }}>
                <Typography variant={'subtitle2'}>
                  Already have an account?{' '}
                  <Link className="link" href="/signin">
                    Login.
                  </Link>
                </Typography>
              </Box>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                loading={isProcessing}
              >
                Sign Up
              </LoadingButton>
            </Box>
          </Grid>
          <Grid
            item
            container
            xs={12}
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              align="center"
            >
              By clicking &quot;Sign up&quot; button you agree with our{' '}
              <Link className="link" href="/company-terms"
              >
                company terms and conditions.
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SignUp;