import ModalLayout from '@/modals/ModalLayout';
import ApplicationContext from '@/contexts/ApplicationContext';
import * as yup from 'yup';

import React, { useContext, useState } from 'react';

import { useFormik } from 'formik';
import {
  Box,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { CustomToastOptions } from '@/utils/constants';

interface IForgotPasswordFormFields {
  email: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required')
});

const ForgotPassword = ({ opened }: { opened: boolean }): JSX.Element => {
  const {
    setShowForgotPassword
  } = useContext(ApplicationContext);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const initialValues: IForgotPasswordFormFields = {
    email: '',
  };

  const handleClose = (): void => {
    setShowForgotPassword(false);
  };

  const onSubmit = async (values: IForgotPasswordFormFields): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch(
        '/api/gateway/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ email: values.email })
        }
      );
      const json = await response.json();
      if (json.success) {
        toast.success(json.message, CustomToastOptions);
      } else {
        toast.error(json.message, CustomToastOptions);
      }
    } catch (error: any) {
      toast.error(error.message, CustomToastOptions);
    } finally {
      setIsProcessing(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit
  });

  return (
    <ModalLayout
      opened={opened}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '85%',
            md: '29rem'
          },
          backgroundColor: 'background.paper',
          overflowY: 'auto',
          borderRadius: '1.2rem',
          padding: '2rem 1.5rem 3rem'
        }}
      >
        <Box marginBottom={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Forgot your password?
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Enter your email address below and we&apos;ll get you back on track.
          </Typography>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant={'subtitle2'} sx={{ marginBottom: 2 }}>
                Enter your email
              </Typography>
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
            <Grid item container xs={12}>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretched', sm: 'center' }}
                justifyContent="center"
                width={1}
                maxWidth={600}
                margin="0 auto"
              >
                <LoadingButton
                  size="large"
                  variant="contained"
                  type="submit"
                  loading={isProcessing}
                >
                  Reset Password
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </ModalLayout>
  );
};

export default ForgotPassword;