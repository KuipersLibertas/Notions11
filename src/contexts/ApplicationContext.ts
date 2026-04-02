import React, { Dispatch, SetStateAction } from 'react';

interface IAppContext {
  authenticated: boolean;
  lang: string;
  setShowSignIn: Dispatch<SetStateAction<boolean>>;
  setShowForgotPassword: Dispatch<SetStateAction<boolean>>;
  setShowUpgradePlan: Dispatch<SetStateAction<boolean>>;
}

const initialData: IAppContext = {
  authenticated: false,
  lang: 'en',
  setShowSignIn: () => {},
  setShowForgotPassword: () => {},
  setShowUpgradePlan: () => {},
};

const ApplicationContext = React.createContext(initialData);

export const ApplicationProvider = ApplicationContext.Provider;
export const ApplicationConsumer = ApplicationContext.Consumer;

export default ApplicationContext;


