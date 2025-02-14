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
    experimental: {
      appDir: true,
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
  };
  export default nextConfig; 