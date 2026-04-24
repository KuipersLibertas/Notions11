/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent the page from being embedded in an iframe (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  // Disable MIME-type sniffing.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Only send the origin as the referrer on cross-origin requests. Prevents
  // internal paths (link slugs, query params) from leaking via Referer header
  // to Google Analytics / AdSense.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Enforce HTTPS for 2 years (including subdomains). Browsers will refuse
  // plain HTTP after the first visit.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Deny access to camera, mic, and geolocation APIs.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Enable DNS prefetching for performance while keeping it explicit.
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Content Security Policy.
  // Notes:
  //  - 'unsafe-inline' for scripts is required for Next.js inline Script tags
  //    (JSON-LD, GA inline init) and MUI/Emotion dynamic styles.
  //  - 'unsafe-eval' is required by some MUI/Emotion SSR hydration paths.
  //  - Tighten further with nonces once Next.js nonce support is adopted.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "frame-src https://bid.g.doubleclick.net",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/random',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      const ESLintPlugin = require('eslint-webpack-plugin');
      config.plugins.push(new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        exclude: ['node_modules'],
      }));
    }
    return config;
  },
};

module.exports = nextConfig;
