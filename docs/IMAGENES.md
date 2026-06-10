# Manejo de imágenes

Este proyecto usa el pipeline de **`astro:assets`** para procesar imágenes en build time. Todas las imágenes "de contenido" (OG, portadas de blog, hero) se optimizan automáticamente a **AVIF** y se generan en distintos tamaños según dónde se usen. No se suben imágenes ya optimizadas a mano.

## Dónde va cada imagen

| Tipo de imagen | Ubicación | Procesada por `astro:assets` |
|---|---|---|
| Portadas de artículos del blog | `src/assets/images/guides/` | Sí |
| Imágenes Open Graph / Twitter Card | `src/assets/images/og/` | Sí |
| Hero de la home | `src/assets/images/og/calculadora-importaciones.png` (reutilizada) | Sí |
| Logo, favicon, fuentes, `_redirects`, `robots.txt` | `public/` | No (se sirven tal cual) |

**Regla simple:** si la imagen tiene que pasar por el optimizador (se muestra en una página o se usa como OG image), va en `src/assets/images/`. Si tiene que servirse exactamente como está (SVG del logo, fuentes, robots.txt), va en `public/`.

> Antes de la migración de 2026-06, todas las imágenes vivían en `public/images/` como PNG sin optimizar (~1.7-2MB cada una). Se movieron a `src/assets/images/` para que Astro las procese (resultado: ~15-40KB en AVIF). Ver el detalle histórico en `docs/superpowers/plans/2026-06-10-image-optimization-astro-assets.md`.

## Cómo agregar la portada de un artículo nuevo

1. Poné el archivo (PNG o JPG, no hace falta optimizarlo a mano) en `src/assets/images/guides/`.
2. En el frontmatter del `.md` del artículo (`src/content/articulos/`), referencialo con una ruta relativa:

   ```yaml
   image: "../../assets/images/guides/nombre-del-archivo.png"
   ```

3. Listo. El campo `image` está validado por el helper `image()` de Zod en `src/content.config.ts`, así que si la ruta está mal el build falla con un error claro.

**El campo `image` es opcional.** Si un artículo no tiene `image` en el frontmatter, tanto `src/pages/blog/index.astro` (tarjeta del listado) como `src/pages/blog/[slug].astro` (portada del artículo) lo manejan con un `{condicional && <Image ... />}` y no rompen — simplemente no muestran imagen. La meta `og:image` cae al logo (`/logo.svg`) en ese caso.

## Cómo se usan las imágenes en el código

### `<Image>` de `astro:assets` (para `<img>` en la página)

Usado en `Hero.astro`, `src/pages/blog/index.astro` (miniaturas) y `src/pages/blog/[slug].astro` (portada del artículo):

```astro
import { Image } from 'astro:assets';
import heroImage from '../../assets/images/og/calculadora-importaciones.png';

<Image
  src={heroImage}
  alt="Descripción accesible"
  format="avif"
  width={1200}
  height={630}
  loading="eager"        // solo para imágenes above-the-fold (hero, portada de artículo)
  fetchpriority="high"   // solo para el LCP de la home (Hero)
/>
```

### `getImage()` (para URLs, ej. meta tags OG/JSON-LD)

Usado en `src/layouts/BaseLayout.astro` y `src/pages/blog/[slug].astro` para generar la URL de la imagen AVIF que va en `og:image` / `twitter:image` / JSON-LD:

```astro
import { getImage } from 'astro:assets';

const optimizedOgImage = await getImage({ src: image, format: 'avif', width: 1200, height: 630 });
// optimizedOgImage.src -> "/assets/xxxxx.avif"
```

## Formatos y tamaños

- **Formato:** `avif` en todos los casos (mejor compresión que WebP/PNG, soportado por todos los navegadores modernos).
- **Tamaño estándar para portadas/OG:** `1200x630` (proporción 1.91:1, estándar de Open Graph).
- **Miniaturas del listado de blog:** `800x420`.

Si agregás un nuevo uso de imagen, mantené `width`/`height` explícitos — evita layout shift (CLS) y es lo que usa Astro para generar el `aspect-ratio`.

## Output del build

Con `build: { assets: 'assets' }` en `astro.config.mjs`, las imágenes optimizadas terminan en `dist/assets/*.avif` (no en `dist/_astro/`, que es el default de Astro).
