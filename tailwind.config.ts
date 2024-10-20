/** @type {import('tailwindcss').Config} */
import { mauve, violet } from '@radix-ui/colors';
import plugin from 'tailwindcss/plugin';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/mobile/**/*.{js,ts,jsx,tsx,mdx}',
    './src/desktop/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary_color: '#0057ff',
        secondary_color: '#27115F',
        info_color: '#2E90FA',
        success_color: '#38CB89',
        waring_color: '#FFAB00',
        error_color: '#F04438',
        neutral_00: '#e8e9ea',
        neutral_01: '#FEFEFE',
        neutral_02: '#F3F5F7',
        neutral_03: '#f7f8fb  ',
        neutral_04: '#6C7275',
        neutral_05: '#343839',
        neutral_06: '#232627',
        neutral_07: '#141718',
        ...mauve,
        ...violet,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontSize: {
        28: ['28px', { lineHeight: '35.42px' }],
        24: ['24px', { lineHeight: '30.36px' }],
        18: ['18px', { lineHeight: '22.77px' }],
        16: ['16px', { lineHeight: '20.24px' }],
        12: ['12px', { lineHeight: '18px' }],
        14: ['14px', { lineHeight: '17.31px' }],
        20: ['20px', { lineHeight: '25.3px' }],
        25: ['25px', { lineHeight: '31.62px' }],
        26: ['26px', { lineHeight: '32.89px' }],
        22: ['22px', { lineHeight: '27.83px' }],
        15: ['15px', { lineHeight: '22.5px' }],
        40: ['40px', { lineHeight: '50.6px' }],
        32: ['32px', { lineHeight: '40.48px' }],
        36: ['36px', { lineHeight: '45.54px' }],
        44: ['44px', { lineHeight: '55.66px' }],
        48: ['48px', { lineHeight: '60.72px' }],
        30: ['30px', { lineHeight: '37.95px' }],
        34: ['34px'],
        78: ['78px', { lineHeight: '87.36px' }],
        50: ['50px', { lineHeight: '63.25px' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        slideDown: {
          from: { height: '0px' },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        slideUp: {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: { height: '0px' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addVariant }) {
      addVariant('disabled-within', '&:has(input:is(:disabled), button:is(:disabled))');
    }),
  ],
};
export default config;
