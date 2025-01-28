/** @type {import('tailwindcss').Config} */ 
module.exports = { 
  content: [ 
    './src/**/*.{js,ts,jsx,tsx,mdx}', 
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}', 
  ], 
  theme: { 
    extend: { 
      colors: { 
        primary: { 
          DEFAULT: '#2C3E50', // Основной тёмно-синий 
          light: '#34495E',   // Светлее основного 
          dark: '#1A2633'     // Темнее основного 
        }, 
        secondary: { 
          DEFAULT: '#27AE60', // Основной зелёный для успеха 
          light: '#2ECC71', 
          dark: '#219653' 
        }, 
        warning: { 
          DEFAULT: '#E67E22',  // Оранжевый для предупреждений 
          light: '#F39C12', 
          dark: '#D35400' 
        }, 
        danger: { 
          DEFAULT: '#E74C3C',  // Красный для ошибок 
          light: '#FC6D65', 
          dark: '#C0392B' 
        }, 
        neutral: { 
          100: '#F7FAFC', 
          200: '#EDF2F7', 
          300: '#E2E8F0', 
          400: '#CBD5E0', 
          500: '#A0AEC0', 
          600: '#718096', 
          700: '#4A5568', 
          800: '#2D3748', 
          900: '#1A202C' 
        } 
      }, 
      tremor: { 
        brand: { 
          faint: "#eff6ff", 
          muted: "#bfdbfe", 
          subtle: "#60a5fa", 
          DEFAULT: "#3b82f6", 
          emphasis: "#1d4ed8", 
          inverted: "#ffffff", 
        }, 
      }, 
    }, 
  }, 
  safelist: [ 
    { 
      pattern: /^(bg|text|border)-(red|orange|yellow|lime|emerald)-/, 
    } 
  ], 
  plugins: [], 
}