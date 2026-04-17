/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f6f7f6',
          100: '#e3e7e2',
          200: '#c5d4c2',
          300: '#9cb896',
          400: '#72946c',
          500: '#52784d',
          600: '#3d5c39',
          700: '#2f4a2c',
          800: '#263d24',
          900: '#1f321e',
          950: '#0f1a0f',
        },
        earth: {
          50: '#fbfaf8',
          100: '#f5f3ed',
          200: '#e8e4d8',
          300: '#d6cfba',
          400: '#c2b596',
          500: '#b09d78',
          600: '#9a8760',
          700: '#806d4e',
          800: '#685a42',
          900: '#544938',
          950: '#2d2720',
        },
        gold: {
          50: '#fbf9f1',
          100: '#f6f2e2',
          200: '#ece2c5',
          300: '#e0cd9f',
          400: '#d4b574',
          500: '#c9a055',
          600: '#bc8742',
          700: '#9c6c36',
          800: '#805831',
          900: '#68482b',
          950: '#382615',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e8ebe8',
          200: '#d1d8d0',
          300: '#b0bbb0',
          400: '#8a9989',
          500: '#6b7d6a',
          600: '#546353',
          700: '#455144',
          800: '#394238',
          900: '#313730',
          950: '#191f19',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'heading-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['2rem', { lineHeight: '1.25' }],
        'title': ['1.5rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 1s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'scale-in': 'scaleIn 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'slide-in': 'slideIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, rgba(15,26,15,0.85) 0%, rgba(45,74,44,0.7) 50%, rgba(15,26,15,0.9) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #c9a055 0%, #d4b574 50%, #e0cd9f 100%)',
        'forest-gradient': 'linear-gradient(180deg, #2f4a2c 0%, #1f321e 100%)',
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
      },
      boxShadow: {
        'elegant': '0 4px 20px -2px rgba(15, 26, 15, 0.08)',
        'elevated': '0 8px 30px -4px rgba(15, 26, 15, 0.12), 0 4px 12px -2px rgba(15, 26, 15, 0.06)',
        'premium': '0 20px 50px -12px rgba(15, 26, 15, 0.2), 0 8px 20px -4px rgba(15, 26, 15, 0.1)',
        'inner-light': 'inset 0 1px 1px rgba(255,255,255,0.3)',
        'glow': '0 0 40px -10px rgba(201, 160, 85, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #52784d 0%, #3d5c39 50%, #c9a055 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gold-gradient': {
          'background': 'linear-gradient(135deg, #d4b574 0%, #c9a055 50%, #e0cd9f 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.08)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'background': 'rgba(15, 26, 15, 0.6)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.premium-border': {
          'border': '1px solid rgba(201, 160, 85, 0.3)',
        },
        '.noise-overlay': {
          'position': 'relative',
        },
        '.noise-overlay::before': {
          'content': '""',
          'position': 'absolute',
          'inset': '0',
          'background-image': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          'opacity': '0.03',
          'pointer-events': 'none',
          'z-index': '1',
        },
      });
    },
  ],
}
