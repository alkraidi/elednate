/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // shadcn passthroughs
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },

        // Eledante brand palette (hardcoded hex per design system)
        brand: {
          bg: '#FFFFFF',
          surface: '#F8F6F3',
          'surface-hover': '#F0EDE8',
          border: '#E8E2D9',
          'border-strong': '#C8BFB0',
          gold: '#B8973A',
          'gold-light': '#D4B86A',
          'gold-muted': '#EDE0C4',
          sapphire: '#2C5F9E',
          'sapphire-light': '#60AED3',
          'sapphire-tint': '#EEF3FB',
          ink: '#1A1714',
          'text-secondary': '#5C5449',
          'text-muted': '#9C9088',
          success: '#4A7C59',
          error: '#C0392B',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        label: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3rem, 6vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        display: ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.005em' }],
        heading: ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.15' }],
        subhead: ['1.25rem', { lineHeight: '1.4' }],
        label: ['0.75rem', { lineHeight: '1', letterSpacing: '0.15em' }],
      },
      borderRadius: {
        lg: '6px',
        md: '4px',
        sm: '2px',
        btn: '2px',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
