import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { addSitemapLastmod } from './src/lib/sitemap-lastmod.mjs';

export default defineConfig({
  site: 'https://calculadoraimportacion.com.ar',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/api/'),
      serialize: addSitemapLastmod,
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
    assets: 'assets',
  },
});
