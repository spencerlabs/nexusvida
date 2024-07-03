import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/{layout,page}.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        wrap: '5.62vw',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
export default config
