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
      optimizeCss: true,
      scrollRestoration: true,
    },

    webpack: (config, { dev, isServer }) => {
      if (!dev && !isServer) {
        Object.assign(config.resolve.alias, {
          'react/jsx-runtime': 'preact/compat/jsx-runtime',
          'react': 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
        });
      }
      return config;
    },
  };
  
  module.exports = nextConfig; // Используем CommonJS!
  