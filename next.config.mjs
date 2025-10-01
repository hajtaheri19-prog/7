import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'https',
        hostname: 'cdn.arzdigital.com',
      },
      {
        protocol: 'https',
        hostname: 'static.idpay.ir',
      },
    ],
  },
};

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(baseConfig);

export default nextConfig;
