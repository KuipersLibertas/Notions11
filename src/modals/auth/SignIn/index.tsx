import ModalLayout from '@/modals/ModalLayout';
import ApplicationContext from '@/contexts/ApplicationContext';
import SignInForm from '@/views/auth/SignIn/Form';

import React, { useContext, useCallback } from 'react';
import {
  Box,
} from '@mui/material';

const SignIn = ({ opened }: { opened: boolean }): JSX.Element => {
  const {
    setShowSignIn,
    setShowForgotPassword
  } = useContext(ApplicationContext);

  const handleClose = (): void => {
    setShowSignIn(false);
  };

  const handleForgotPassword = useCallback((): void => {
    setShowSignIn(false);
    setShowForgotPassword(true);
  }, []);

  const handleLogin = useCallback((): void => {
    setShowSignIn(false);   
    window.location.reload();
  }, []);
  
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
        <SignInForm
          onCallback={handleLogin}
          onShowForgotPassword={handleForgotPassword}
        />   
      </Box>
    </ModalLayout>
  );
};

export default SignIn;