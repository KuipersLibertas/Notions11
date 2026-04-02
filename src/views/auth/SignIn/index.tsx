'use client';

import ApplicationContext from '@/contexts/ApplicationContext';

import React, { useCallback, useContext } from 'react';
import Container from '@/components/Container';
import SignInForm from '@/views/auth/SignIn/Form';

const SignIn = (): JSX.Element => {

  const { setShowForgotPassword } = useContext(ApplicationContext);
  
  const handleForgotPassword = useCallback((): void => {
    setShowForgotPassword(true);
  }, []);

  const handleLogin = useCallback((): void => {
    location.href = '/';
  }, []);

  return (
    <Container sx={{
      maxWidth: '40rem',
      minHeight: 'calc(100vh - 207px)'
    }}>
      <SignInForm onShowForgotPassword={handleForgotPassword} onCallback={handleLogin} />
    </Container>
  );
};

export default SignIn;