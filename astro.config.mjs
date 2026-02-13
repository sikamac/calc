import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tudominio.com',
  integrations: [
    react(),
    tailwind({
      config: {
        path: './tailwind.config.mjs'
      }
    })
  ],
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always'
  }
});
