// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-roast': '#260801',
        terracotta: '#A64941',
        'off-white': '#F2F2F2',
        'silver-mist': '#A6A6A6',
        'rich-black': '#0D0D0D',
      },
    },
  },
  plugins: [],
};
export default config;
