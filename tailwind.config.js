import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode - Page background
        'bg-light': '#C7DFED',
        'bg-dark': '#1A2332',
        
        // Primary
        'primary': '#1D5AAD',
        'primary-light': '#2563EB',
        'primary-dark': '#154A8C',
        
        // Accent
        'accent': '#17A2D8',
        'accent-light': '#06B6D4',
        'accent-dark': '#0EA5E9',
        
        // Surfaces
        'surface-light': '#FFFFFF',
        'surface-light-secondary': '#F8FAFC',
        'surface-dark': '#2A3A4A',
        'surface-dark-secondary': '#1F2A37',
        
        // Text
        'text-light': '#000000',
        'text-light-secondary': '#6B7280',
        'text-dark': '#FFFFFF',
        'text-dark-secondary': '#D1D5DB',
        
        // Borders
        'border-light': '#E5E7EB',
        'border-dark': '#4B5563',
      },


      borderColor: {
        base: 'var(--color-border)',
      },
    },
  },
  plugins: [],
}

export default config