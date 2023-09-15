const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,

  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        // auth0 username/password avatars
        hostname: 's.gravatar.com',
      },
      {
        // Google avatars
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Github Avatars
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
