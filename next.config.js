/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // For any remote images you might use
  },
  // Explicitly disable the App Router to use Pages Router only
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;