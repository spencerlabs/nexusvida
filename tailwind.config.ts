import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      spacing: {
        wrap: '5.62vw',
      },
    },
  },
  plugins: [],
}
export default config
