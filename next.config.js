/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['opros.sot.kg'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig; 