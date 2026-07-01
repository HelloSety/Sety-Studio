import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        black: '#050505',
        white: '#fafafa',
        surface: {
          1: '#0a0a0a',
          2: '#111111',
          3: '#1a1a1a',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.12)',
          strong: 'rgba(255,255,255,0.2)',
        },
        text: {
          primary: '#fafafa',
          secondary: '#888888',
          muted: '#555555',
        },
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
        '9xl': ['8rem', { lineHeight: '0.92', letterSpacing: '-0.05em' }],
        '8xl': ['6rem', { lineHeight: '0.94', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        section: '10rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'grain': 'grain 8s steps(10) infinite',
        'marquee': 'marquee 32s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -1%)' },
          '50%': { transform: 'translate(-3%, 3%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(1%, 3%)' },
          '90%': { transform: 'translate(3%, -2%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
