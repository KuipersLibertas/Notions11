import React from 'react';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/redux/Providers';
import Script from 'next/script';

import './globals.css';
import 'aos/dist/aos.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Password Protect Your Notion Links',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          {/* Google Analytics — fires on every page */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-DVL1BCNBS0"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DVL1BCNBS0', { page_path: window.location.pathname });
            `}
          </Script>
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </body>
      </html>
    </Providers>
  );
}
