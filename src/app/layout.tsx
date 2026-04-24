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

const SITE_URL = 'https://www.notions11.com';
const SITE_NAME = 'Notions11';
const TITLE = 'Password Protect Your Notion Links — Notions11';
const DESCRIPTION =
  'Password-protect your Notion links in seconds. Add custom URLs, expiry limits, download analytics, and branded sharing — no coding required. Free to start.';
const OG_IMAGE = `${SITE_URL}/assets/images/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — Notions11',
  },
  description: DESCRIPTION,
  keywords: [
    'password protect notion link',
    'notion link protection',
    'secure notion sharing',
    'notion password',
    'protect notion page',
    'notion link analytics',
    'notion custom url',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Notions11 — Password Protect Your Notion Links' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Notions_11',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    'google-adsense-account': 'ca-pub-3746260233604933',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/images/newlogo3.png`,
      },
      sameAs: ['https://x.com/Notions_11'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@notions11.com',
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
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
          {/* JSON-LD structured data */}
          <Script
            id="json-ld-org"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
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
