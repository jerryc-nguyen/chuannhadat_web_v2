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
      center: 'true',
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
        'primary-text': '#080809',
        'secondary-text': '#65686c',
        'secondary-dark-text': '#4e5154',
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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontSize: {
        '12': ['12px', { lineHeight: '18px' }],
        '14': ['14px', { lineHeight: '17.31px' }],
        '15': ['15px', { lineHeight: '22.5px' }],
        '16': ['16px', { lineHeight: '20.24px' }],
        '18': ['18px', { lineHeight: '22.77px' }],
        '20': ['20px', { lineHeight: '25.3px' }],
        '22': ['22px', { lineHeight: '27.83px' }],
        '24': ['24px', { lineHeight: '30.36px' }],
        '25': ['25px', { lineHeight: '31.62px' }],
        '26': ['26px', { lineHeight: '32.89px' }],
        '28': ['28px', { lineHeight: '35.42px' }],
        '30': ['30px', { lineHeight: '37.95px' }],
        '32': ['32px', { lineHeight: '40.48px' }],
        '34': ['34px'],
        '36': ['36px', { lineHeight: '45.54px' }],
        '40': ['40px', { lineHeight: '50.6px' }],
        '44': ['44px', { lineHeight: '55.66px' }],
        '48': ['48px', { lineHeight: '60.72px' }],
        '50': ['50px', { lineHeight: '63.25px' }],
        '78': ['78px', { lineHeight: '87.36px' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        slideDown: {
          from: {
            height: '0px',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        slideUp: {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0px',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
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
    plugin(({ addVariant }) => {
      addVariant('disabled-within', '&:has(input:is(:disabled), button:is(:disabled))');
    }),
    require('tailwind-scrollbar-hide'),
  ],
};
export default config;
