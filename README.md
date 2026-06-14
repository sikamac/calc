# 🧮 Calculadora de Importaciones Argentina

Web app de **GIST POINT** para calcular costos de importación en Argentina. Construida con Astro, React y TypeScript, optimizada para SEO y performance, con un backend mínimo en Cloudflare Workers + D1 para el formulario de contacto.

Sitio en producción: [calculadoraimportacion.com.ar](https://calculadoraimportacion.com.ar)

## 🚀 Stack

- **Framework:** Astro 5 (`output: 'static'`)
- **Componentes interactivos:** React 19 (solo donde hace falta interactividad — la calculadora)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4 (vía `@tailwindcss/vite`) + `@tailwindcss/typography` para el contenido del blog
- **Imágenes:** `astro:assets` (AVIF generado en build) — ver [`docs/IMAGENES.md`](docs/IMAGENES.md)
- **Contenido:** Content Collections de Astro (`src/content/articulos/`, en Markdown)
- **Backend:** Cloudflare Worker (`worker.js`) + D1 (`migrations/`) para el formulario de contacto y el panel de leads
- **Despliegue:** Cloudflare Workers (assets + worker), vía `wrangler`

## 🏗️ Estructura del proyecto

```
calc/
├── src/
│   ├── assets/images/      # Imágenes fuente (procesadas por astro:assets, ver docs/IMAGENES.md)
│   │   ├── og/              # Imágenes Open Graph / hero
│   │   └── guides/           # Portadas de artículos del blog
│   ├── components/
│   │   ├── calculator/      # ImportCalculator.tsx (React) — la calculadora
│   │   ├── layout/          # Header, Footer
│   │   ├── sections/         # Hero y otras secciones de la home
│   │   └── ui/                # Componentes chicos reutilizables (Logo, etc.)
│   ├── content/
│   │   ├── articulos/        # Artículos del blog (Markdown), colección "articulos"
│   │   └── ../content.config.ts  # Schema de la colección (Zod)
│   ├── lib/
│   │   └── seo.ts            # Normalización de URLs canónicas y URLs en JSON-LD
│   ├── layouts/
│   │   └── BaseLayout.astro  # <head>, meta tags SEO/OG, JSON-LD, fuentes, WhatsApp flotante
│   ├── pages/                # Rutas del sitio (ver tabla abajo)
│   └── styles/global.css     # Estilos globales / Tailwind
├── public/                  # Assets estáticos servidos tal cual (logo, fuentes, robots.txt, _redirects)
├── migrations/              # Migraciones SQL de la base D1
├── worker.js                # Worker de Cloudflare: API /api/contact y /api/leads
├── wrangler.jsonc           # Config de Cloudflare (Worker + assets + D1)
├── scripts/                 # Scripts de utilidad (ej. check-brand-markup.mjs)
└── docs/                    # Documentación (planes, specs; este README la indexa)
```

## 🗺️ Páginas / Rutas

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `src/pages/index.astro` | Home — hero, beneficios, CTAs |
| `/calculadora` | `src/pages/calculadora/index.astro` | Calculadora de importaciones (componente React) |
| `/blog` | `src/pages/blog/index.astro` | Listado de artículos (colección `articulos`) |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Artículo individual |
| `/herramientas-para-negocios` | `src/pages/herramientas-para-negocios.astro` | Página de herramientas/servicios para negocios |
| `/contacto` | `src/pages/contacto.astro` | Formulario de contacto/asesoramiento (POST a `/api/contact`) |
| `/admin/leads` | `src/pages/admin/leads.astro` | Panel para ver los leads del formulario (requiere `ADMIN_TOKEN`, `noindex`) |

> **Nota histórica:** la ruta `/blog` se llamaba `/articulos`. Hay redirecciones 301 en `public/_redirects` por si quedan enlaces viejos indexados.

## 📝 Contenido / Blog

Los artículos viven en `src/content/articulos/*.md` y forman la colección `articulos` (definida en `src/content.config.ts`). El nombre de la colección es interno — las páginas públicas se sirven en `/blog`.

### Frontmatter de un artículo

```yaml
---
title: "Título del artículo"
date: 2026-06-10
updatedDate: 2026-06-12       # opcional — si se edita después de publicar
category: "Logística"          # se muestra como badge en el artículo
image: "../../assets/images/guides/nombre.png"  # opcional, ver docs/IMAGENES.md
description: "Resumen para meta description / tarjeta del listado"
author: "Equipo de GIST POINT"  # opcional, default "Equipo de GIST POINT"
tags: ["tag1", "tag2"]
---

Contenido en Markdown. La página ya renderiza un <h1> con `title`,
así que el cuerpo NO debe repetir el título con `# Título`.
```

### Para agregar un artículo nuevo

1. Creá `src/content/articulos/mi-articulo.md` con el frontmatter de arriba.
2. (Opcional) Agregá una imagen de portada — ver [`docs/IMAGENES.md`](docs/IMAGENES.md).
3. Escribí el contenido empezando directo con el primer párrafo (sin `# Título`, ya está en el layout).
4. `npm run build` para verificar que el frontmatter pasa la validación de Zod y que la página se genera en `/blog/mi-articulo`.
5. Si el artículo explica un concepto que se usa en la calculadora (ej. Incoterms, comisiones), considerá linkearlo desde `ImportCalculator.tsx` como hint debajo del campo correspondiente.

## 🖼️ Imágenes

Ver [`docs/IMAGENES.md`](docs/IMAGENES.md) — pipeline de `astro:assets`, dónde poner cada imagen (`src/assets/images/` vs `public/`), formatos y tamaños.

## 🔤 Tipografía / Fuentes

La fuente de marca es **Jost** (pesos 600 y 700), usada en `.brand-wordmark` y `.brand-name` (logo y nombre "GIST POINT" en Header/Footer). El resto de la tipografía usa fuentes del sistema.

- El archivo está **incrustado en el repo**: `public/fonts/jost-latin-600-700.woff2` (un único `.woff2` con ambos pesos, subset solo Latin).
- Se carga vía `@font-face` con `font-display: swap` en `src/layouts/BaseLayout.astro` (bloque `<style is:global>` al final del archivo) — no depende de Google Fonts ni de ningún CDN externo.
- Si necesitás agregar otro peso/estilo de Jost (o cambiar de fuente), descargá el `.woff2` correspondiente, ponelo en `public/fonts/` y agregá un nuevo bloque `@font-face` siguiendo el mismo patrón.

## 🧮 Calculadora (`ImportCalculator.tsx`)

Componente React (`src/components/calculator/ImportCalculator.tsx`), montado en `/calculadora`. Tiene dos pestañas:

- **Precio de compra:** ingresás el Valor EXW y configurás aranceles, derechos antidumping, IVA, percepciones, Ingresos Brutos, flete/seguro y gastos de despacho. Calcula el costo total de importación puesto en Argentina.
- **Precio de venta:** a partir del costo calculado, definís margen neto deseado, comisión del canal de venta (vendedor/plataforma + medio de pago), gastos fijos, honorarios de socios e IIBB de venta. Calcula precio de venta sugerido, margen bruto/neto y total recibido.

Varios campos tienen links contextuales a artículos del blog que explican el concepto (Incoterms, margen bruto vs. neto, comisión de venta) — si cambiás esos campos, revisá que los links sigan apuntando a artículos vigentes.

## 📡 Backend (Cloudflare Worker + D1)

El sitio se sirve como **assets estáticos + un Worker** (no Cloudflare Pages tradicional). Configuración en `wrangler.jsonc`:

- `worker.js` expone:
  - `POST /api/contact` — recibe el formulario de `/contacto`, valida y guarda en D1 (tabla `impocalc_contacts`), envía notificación por email (`send_email` binding).
  - `GET /api/leads` — devuelve los leads guardados, protegido con `Authorization: Bearer <ADMIN_TOKEN>` (lo consume `/admin/leads`).
- `worker.js` también normaliza URLs públicas antes de servir assets:
  - `/calculadora/` → `/calculadora`
  - `/calculadora.html` → `/calculadora`
  - `/index.html` → `/`
- Base de datos D1 `calc-contacts`, migraciones en `migrations/` (aplicar con `npx wrangler d1 migrations apply calc-contacts --remote`).
- Variables/secrets necesarios: `ADMIN_TOKEN` (panel de leads) y los que use el envío de email — configurarlos con `wrangler secret put`.

> `BACKEND.md` y `CLOUDFLARE-DEPLOY.md` en la raíz documentan un setup anterior basado en PHP + Cloudflare Pages dashboard que **ya no refleja la implementación actual** (Worker + D1). Ante una duda de "cómo funciona realmente", confiar en `worker.js` y `wrangler.jsonc`.

## 🛠️ Desarrollo

### Requisitos

- Node.js 22.20.0 (ver `engines` en `package.json`)
- npm 11.16.0

### Instalación

```bash
git clone https://github.com/sikamac/calc.git
cd calc
npm install
npm run dev          # http://localhost:4321
```

### Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo (Astro)
npm run build        # Build de producción -> dist/
npm run preview      # Build + servir con wrangler (simula el Worker)
npm run deploy       # Build + wrangler deploy (publica a Cloudflare)
npm run astro ...    # Comandos de Astro CLI (ej. npm run astro check)
npm run check:brand  # Verifica que "GIST POINT" esté wrappeado en <span class="brand-name"> en el contenido
```

## 🌿 Git Workflow

Conventional Commits + feature branches. Detalle completo en [GIT-WORKFLOW.md](./GIT-WORKFLOW.md) y [COMANDOS-DIARIOS.md](./COMANDOS-DIARIOS.md).

```bash
git checkout -b feature/nueva-funcionalidad
# ... cambios ...
git add <archivos>
git commit -m "feat: agregar componente X"
git push origin feature/nueva-funcionalidad
```

Prefijos: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `chore:`.

## ☁️ Despliegue

```bash
npm run build     # genera dist/
npm run deploy    # build + wrangler deploy
```

`wrangler.jsonc` define el dominio custom (`calculadoraimportacion.com.ar`), el binding de assets (`./dist`), la base D1 y el binding de email. No requiere configuración manual en el dashboard de Cloudflare Pages — el deploy es vía CLI con `wrangler`.

## 📱 Performance

Imágenes optimizadas con `astro:assets` (AVIF), CSS crítico inline (`build.inlineStylesheets: 'always'`), JavaScript mínimo (React solo en la calculadora) y fuente local sin dependencias externas (ver secciones de arriba).

## 🔍 SEO

- Meta tags, Open Graph y Twitter Cards generados centralmente en `BaseLayout.astro` (recibe `title`, `description`, `image`, `schema` por props)
- JSON-LD (`BreadcrumbList`, `BlogPosting`, `ItemList`, etc.) por página
- Sitemap automático (`@astrojs/sitemap`, excluye `/admin/`)
- `public/robots.txt` y `public/_redirects` (incluye redirecciones 301 de `/articulos` → `/blog`)

### URLs canónicas

La variante canónica del sitio es **sin trailing slash**:

- Correcto: `https://calculadoraimportacion.com.ar/calculadora`
- Alternativa redirigida: `https://calculadoraimportacion.com.ar/calculadora/`

Esta decisión está reflejada en varias capas:

- `astro.config.mjs` usa `trailingSlash: 'never'` y `build.format: 'file'` para que Astro genere rutas limpias sin barra final en el sitemap.
- `src/lib/seo.ts` centraliza la normalización de URLs canónicas y URLs internas de JSON-LD. Quita `.html`, quita trailing slash, limpia query strings, y conserva fragmentos (`#webapp`, `#organization`) cuando corresponden a identificadores de schema.
- `BaseLayout.astro` usa esas utilidades para `<link rel="canonical">`, `og:url` y JSON-LD.
- `wrangler.jsonc` tiene `run_worker_first: true` para que `worker.js` pueda aplicar redirecciones HTTP antes de servir assets.
- `worker.js` redirige con `301` las variantes no canónicas con barra final o `.html` hacia la URL limpia.

Si se agrega una nueva página, usar rutas internas sin barra final (`/contacto`, `/blog/slug`) y dejar que `BaseLayout.astro` genere la canonical. Después de cambios de rutas o SEO, correr `npm run build` y revisar `dist/sitemap-0.xml` y el HTML generado.

## 📚 Documentación adicional

- [`docs/IMAGENES.md`](docs/IMAGENES.md) — pipeline de imágenes con `astro:assets`
- [`GIT-WORKFLOW.md`](./GIT-WORKFLOW.md) / [`COMANDOS-DIARIOS.md`](./COMANDOS-DIARIOS.md) — flujo de Git y comandos del día a día
- [`PLANIFICACION.md`](./PLANIFICACION.md) / [`ESTADO-DEL-PROYECTO.md`](./ESTADO-DEL-PROYECTO.md) — historial de planificación del proyecto (puede contener secciones desactualizadas, ej. "sistema de noticias" → ahora es el blog en `/blog`)
- [`BACKEND.md`](./BACKEND.md) / [`CLOUDFLARE-DEPLOY.md`](./CLOUDFLARE-DEPLOY.md) — documentación de un setup anterior (PHP + Pages); el setup actual está en `worker.js` + `wrangler.jsonc`, descrito arriba
- `docs/superpowers/plans/` y `docs/superpowers/specs/` — planes y specs de features implementadas con Superpowers

## 📞 Contacto

- **Email:** info@gist-point.com
- **Issues:** [GitHub Issues](https://github.com/sikamac/calc/issues)
