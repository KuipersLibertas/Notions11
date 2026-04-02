/** @type {import('next').NextConfig} */

const ESLintPlugin = require('eslint-webpack-plugin');
const eslintOptions = {
  extensions: [`js`, `jsx`, `ts`, `tsx`],
  exclude: [`node_modules`],
};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
      config.plugins.push(new ESLintPlugin(eslintOptions))
      // config.module.rules.push({
      //   test: /\.js|\.jsx|\.tsx|\.ts$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     // eslint options (if necessary)
      //   }
      // })
    }
    return config
  }
}

module.exports = nextConfig
