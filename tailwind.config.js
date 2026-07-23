/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#EDF6F1',
          card: '#FFFFFF',
          cardAlt: '#E0F0E8',
          cardAltDeep: '#CCEFDD',
          cardAltStrong: '#A7E1C7',
        },
        accent: {
          flat: '#1E9E72',
          gradientStart: '#4FC79A',
          gradientEnd: '#0A6B4C',
          gold: '#D4A017',
        },
        text: {
          primary: '#1F1F1F',
          secondary: '#6A6A6A',
        },
        divider: '#D6EADF',
        status: {
          error: '#D64545',
          success: '#1E9E67',
        },
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        sheet: '20px',
        pill: '9999px',
      },
      fontSize: {
        title: ['20px', { fontWeight: '700' }],
        section: ['16px', { fontWeight: '600' }],
        body: ['14px', { fontWeight: '400' }],
        caption: ['12px', { fontWeight: '400' }],
        numeric: ['30px', { fontWeight: '700' }],
        button: ['16px', { fontWeight: '600' }],
      },
      spacing: {
        18: '72px',
      },
    },
  },
  plugins: [],
};
