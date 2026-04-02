'use client';

import React from 'react';
import HelpLayout from '@/views/shared/layouts/HelpLayout';

const PrivacyPolicy = (): JSX.Element => {
 
  return (
    <HelpLayout title="Privacy Policy">
      <p>Your privacy is important to us. It is Notions11&apos;s policy to respect your privacy regarding any information we may collect from you across our website, {process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}.</p>
      <p>We don&apos;t ask for your personal information unless we truly need it. When we do, we&apos;ll only collect what we need by fair and lawful means and, where appropriate, with your knowledge or consent. We&apos;ll also let you know why we&apos;re collecting it and how it will be used.</p>
      <p>We don&apos;t share your personal information with third-parties, except where required by law. We will only retain personal information for as long as necessary to provide you with a service.</p>
      <p>We don&apos;t store your personal information on our servers unless it&apos;s required for providing a service to you. What we store, we&apos;ll protect within commercially acceptable means to protect your personal information from loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
      <p>By creating an account on Notions11.com, users agree and opt-in to receive periodic emails from Notions11. Users can at all times, choose to unsubscribe from the mailinglist and choose not to receive emails from Notions11 anymore.</p>
    </HelpLayout>    
  );
};

export default PrivacyPolicy;