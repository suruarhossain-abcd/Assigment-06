/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.magnific.com',
      },
    ],
  },
};

export default nextConfig;
