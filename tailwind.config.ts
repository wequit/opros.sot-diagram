import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
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