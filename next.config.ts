/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cambia esto:
  // experimental: {
  //   serverComponentsExternalPackages: [],
  // },

  // Por esto:
  serverExternalPackages: [],

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
