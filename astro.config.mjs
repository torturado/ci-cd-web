import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  base: '/ci-cd-web/',
  build: {
    assets: '_assets'
  }
});

