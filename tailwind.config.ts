import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#32CD32', // Ваш зеленый цвет для фона
        secondary: '#F0F0F0', // Серый фон
      },
    },
  },
  plugins: [],
} satisfies Config;
