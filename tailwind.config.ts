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
        'dark-roast': 'var(--dark-roast)',
        terracotta: 'var(--terracotta)',
        'off-white': 'var(--off-white)',
        'silver-mist': 'var(--silver-mist)',
        'rich-black': 'var(--rich-black)',
      },
    },
  },
  plugins: [],
};
export default config;
