/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // For any remote images you might use
  }
  // Removed the experimental.appDir option that was causing errors
};

module.exports = nextConfig;