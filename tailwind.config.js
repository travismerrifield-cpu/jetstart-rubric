/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jetson: {
          forest:  '#0F1F0D',
          fern:    '#113823',
          green:   '#3CD567',
          lime:    '#CBFF8A',
          cream:   '#FBFAF1',
          grey:    '#666958',
          midgrey: '#ACAA93',
          softgrey:'#E2E1D3',
        },
      },
    },
  },
  plugins: [],
}
