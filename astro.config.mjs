import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server', // Necesario para endpoints API. Para GitHub Pages, usa Vercel/Netlify
  base: '/ci-cd-web/',
  build: {
    assets: '_assets'
  }
});

