/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['opros.sot.kg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 