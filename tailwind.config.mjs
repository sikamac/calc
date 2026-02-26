/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#0066CC',
        accent: '#FF6600'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#003366',
              fontWeight: '700',
            },
            h2: {
              color: '#003366',
              fontWeight: '700',
            },
            h3: {
              color: '#003366',
              fontWeight: '600',
            },
            h4: {
              color: '#003366',
              fontWeight: '600',
            },
            a: {
              color: '#FF6600',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
              color: '#003366',
            },
            blockquote: {
              borderLeftColor: '#FF6600',
              backgroundColor: '#fff7ed',
              padding: '1rem 1.5rem',
              borderRadius: '0 0.5rem 0.5rem 0',
            },
            'ul > li::marker': {
              color: '#FF6600',
            },
            'ol > li::marker': {
              color: '#FF6600',
            },
            table: {
              borderColor: '#e5e7eb',
            },
            thead: {
              color: '#003366',
              backgroundColor: '#f3f4f6',
            },
            hr: {
              borderColor: '#e5e7eb',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
