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
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
    assets: 'assets'
  }
});
