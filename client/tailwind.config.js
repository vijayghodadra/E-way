/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14532D', // Deep Luxury Emerald
          dark: '#0f3d21',
          light: '#166534',
        },
        secondary: {
          DEFAULT: '#F5F5F4', // Soft Alabaster & Warm Stone
          dark: '#e7e5e4',
          light: '#fafaf9',
        },
        accent: {
          DEFAULT: '#D4AF37', // Satin Champagne Gold
          dark: '#b89428',
          light: '#e0c158',
        },
        background: '#FFFFFF',
        text: '#1F2937',
        muted: '#6B7280',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(20, 83, 45, 0.08)',
        'luxury-hover': '0 30px 60px -15px rgba(20, 83, 45, 0.15)',
        'gold': '0 10px 25px -5px rgba(212, 175, 55, 0.3)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
