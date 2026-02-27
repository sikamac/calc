import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://calculadoraimportacion.com.ar',

  integrations: [
    react(),
    tailwind({
      config: {
        path: './tailwind.config.mjs'
      }
    }),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
        },
      },
    }),
  ],

  output: 'static',
  trailingSlash: 'never',

  build: {
    inlineStylesheets: 'always'
  },

  adapter: cloudflare()
});