export default {
    plugins: {
      'postcss-preset-env': {
        features: {
          'nesting-rules': true,
          'custom-properties': false
        },
      },
      'tailwindcss': {},
      'autoprefixer': {},
    },
  } 