/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Fondo / superficies
        bg:      '#0C0C0C',
        card:    '#1A1A1A',
        surface: '#242424',

        // Marca (antes "orange")
        brand:      '#F97316',
        'brand-dim':  '#2A1608',
        'brand-text': '#FB923C',

        // Bordes
        border:        'rgba(255,255,255,0.07)',
        'border-bright': 'rgba(255,255,255,0.11)',

        // Texto
        text1: '#F5F5F5',
        text2: '#9CA3AF',
        text3: '#4B5563',

        // Estados
        blue:       '#60A5FA',
        'blue-dim':   '#0D1B2E',
        green:      '#4ADE80',
        'green-dim':  '#0A1F0F',
        red:        '#F87171',
        'red-dim':    '#1F0808',
        amber:      '#FBBF24',
        'amber-dim':  '#1F1507',
      },
      fontFamily: {
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}
