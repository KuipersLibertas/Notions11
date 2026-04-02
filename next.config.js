/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
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
    return config
  }
}

module.exports = nextConfig
