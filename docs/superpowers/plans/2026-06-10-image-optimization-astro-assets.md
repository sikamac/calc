, # Image Optimization with astro:assets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 8 oversized PNGs (~1.7-2MB each, ~15MB total) served from `public/images/` with AVIF images generated at build time by Astro's `astro:assets` pipeline, while preserving (and improving) all SEO metadata (OG/Twitter image tags, JSON-LD, `alt` text).

**Architecture:** Move source PNGs into `src/assets/images/` so Astro's image pipeline can process them. Use the `<Image>` component for in-page `<img>` tags (hero, article covers, guide thumbnails) and `getImage()` for cases needing a URL string (OG/Twitter meta tags, JSON-LD, CSS `background-image`). Update the `articulos` content collection schema to use the `image()` Zod helper so frontmatter image references become typed `ImageMetadata` objects validated at build time.

**Tech Stack:** Astro 5 (`astro:assets`, `astro:content`), Zod, sharp (already a transitive dependency).

**Format/quality decisions (confirmed with user):**
- Format: `avif` everywhere
- Hero image (LCP) and article covers: 1200x630 (matches existing `aspect-ratio: 1200/630` CSS)
- Guide thumbnails (3-col grid cards): 800x420
- `herramientas-para-negocios.astro` hero background: width 1600 (full-bleed), height auto
- Add `og:image:width`, `og:image:height`, `og:image:type` meta tags (currently missing) when the image is a processed asset

**Important:** Tasks 1-7 modify interdependent files. The site will **not build successfully** until all of Tasks 1-7 are done — this is expected and not a bug to fix mid-way. Do not commit until Task 8. Each task should still be reviewed for correctness on its own terms (code quality, matches the spec below) even though `npm run build` won't pass yet.

---

### Task 1: Move image assets from `public/` to `src/assets/`

**Files:**
- Move: `public/images/og/calculadora-importaciones.png` → `src/assets/images/og/calculadora-importaciones.png`
- Move: `public/images/og/herramientas-negocios.png` → `src/assets/images/og/herramientas-negocios.png`
- Move: `public/images/guides/margen-bruto-neto.png` → `src/assets/images/guides/margen-bruto-neto.png`
- Move: `public/images/guides/importar-china-argentina.png` → `src/assets/images/guides/importar-china-argentina.png`
- Move: `public/images/guides/primera-importacion.png` → `src/assets/images/guides/primera-importacion.png`
- Move: `public/images/guides/impuestos-importacion.png` → `src/assets/images/guides/impuestos-importacion.png`
- Move: `public/images/guides/valor-cif.png` → `src/assets/images/guides/valor-cif.png`
- Move: `public/images/guides/ncm-clasificacion.png` → `src/assets/images/guides/ncm-clasificacion.png`

`astro:assets` only processes images that live inside `src/` and are imported as ES modules. Using `git mv` preserves file history.

- [ ] **Step 1: Create destination directories and move files**

```bash
mkdir -p src/assets/images/og src/assets/images/guides
git mv public/images/og/calculadora-importaciones.png src/assets/images/og/calculadora-importaciones.png
git mv public/images/og/herramientas-negocios.png src/assets/images/og/herramientas-negocios.png
git mv public/images/guides/margen-bruto-neto.png src/assets/images/guides/margen-bruto-neto.png
git mv public/images/guides/importar-china-argentina.png src/assets/images/guides/importar-china-argentina.png
git mv public/images/guides/primera-importacion.png src/assets/images/guides/primera-importacion.png
git mv public/images/guides/impuestos-importacion.png src/assets/images/guides/impuestos-importacion.png
git mv public/images/guides/valor-cif.png src/assets/images/guides/valor-cif.png
git mv public/images/guides/ncm-clasificacion.png src/assets/images/guides/ncm-clasificacion.png
rmdir public/images/og public/images/guides public/images
```

- [ ] **Step 2: Verify the move**

Run: `find src/assets/images -type f && find public/images -type f 2>&1`

Expected: 8 files listed under `src/assets/images/og/` and `src/assets/images/guides/`. The `public/images` find should print `No such file or directory` (directory no longer exists).

- [ ] Do not commit yet (see Task 8).

---

### Task 2: Update content collection schema and article frontmatter

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/content/articulos/diferencia-margen-bruto-neto.md:6`
- Modify: `src/content/articulos/impuestos-importacion-argentina.md:6`
- Modify: `src/content/articulos/valor-cif-importacion.md:6`
- Modify: `src/content/articulos/ncm-clasificacion-arancelaria.md:6`
- Modify: `src/content/articulos/importar-de-china-a-argentina-costos.md:6`
- Modify: `src/content/articulos/paso-a-paso-importar-primera-vez.md:6`

The `image()` Zod helper makes Astro resolve the frontmatter `image` field as an image import, validating at build time that the file exists and giving consumers a typed `ImageMetadata` object instead of a raw string.

- [ ] **Step 1: Update the collection schema**

Replace the full contents of `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    category: z.string(),
    image: image().optional(),
    description: z.string(),
    author: z.string().default('Equipo de GIST POINT'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articulos };
```

- [ ] **Step 2: Update frontmatter `image` paths**

The `image()` helper resolves paths relative to the `.md` file's location (`src/content/articulos/`), so `/images/guides/X.png` becomes `../../assets/images/guides/X.png`.

In `src/content/articulos/diferencia-margen-bruto-neto.md`, line 6:
```yaml
image: "/images/guides/margen-bruto-neto.png"
```
becomes:
```yaml
image: "../../assets/images/guides/margen-bruto-neto.png"
```

In `src/content/articulos/impuestos-importacion-argentina.md`, line 6:
```yaml
image: "/images/guides/impuestos-importacion.png"
```
becomes:
```yaml
image: "../../assets/images/guides/impuestos-importacion.png"
```

In `src/content/articulos/valor-cif-importacion.md`, line 6:
```yaml
image: "/images/guides/valor-cif.png"
```
becomes:
```yaml
image: "../../assets/images/guides/valor-cif.png"
```

In `src/content/articulos/ncm-clasificacion-arancelaria.md`, line 6:
```yaml
image: "/images/guides/ncm-clasificacion.png"
```
becomes:
```yaml
image: "../../assets/images/guides/ncm-clasificacion.png"
```

In `src/content/articulos/importar-de-china-a-argentina-costos.md`, line 6:
```yaml
image: "/images/guides/importar-china-argentina.png"
```
becomes:
```yaml
image: "../../assets/images/guides/importar-china-argentina.png"
```

In `src/content/articulos/paso-a-paso-importar-primera-vez.md`, line 6:
```yaml
image: "/images/guides/primera-importacion.png"
```
becomes:
```yaml
image: "../../assets/images/guides/primera-importacion.png"
```

- [ ] **Step 3: Verify**

Run: `grep -n "image:" src/content/articulos/*.md`

Expected: all 6 lines show `image: "../../assets/images/guides/...png"`.

- [ ] Do not commit yet (see Task 8).

---

### Task 3: Update `BaseLayout.astro` for astro:assets + AVIF OG images

**Files:**
- Modify: `src/layouts/BaseLayout.astro:1-36` (frontmatter)
- Modify: `src/layouts/BaseLayout.astro:135-150` (Open Graph / Twitter meta tags)

This removes the filesystem-existence check (`existsSync`) — no longer needed since imported images are guaranteed to exist at build time (the build fails otherwise) — and generates an AVIF OG image via `getImage()`. Also adds `og:image:width/height/type` meta tags.

- [ ] **Step 1: Replace the frontmatter script**

Find (lines 1-36):
```astro
---
import '../styles/global.css';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

type SchemaNode = Record<string, unknown>;

interface Props {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article';
  schema?: SchemaNode | SchemaNode[];
}

const { 
  title, 
  description, 
  image = '/images/og/calculadora-importaciones.png',
  imageAlt = 'Calculadora de importaciones',
  url, 
  locale = 'es_AR',
  type = 'website',
  schema = []
} = Astro.props;

const siteTitle = `${title} | Calculadora de Importaciones Argentina`;
const siteUrl = (Astro.site?.href || 'https://calculadoraimportacion.com.ar').replace(/\/$/, '');
const canonicalUrl = url || siteUrl;
const pageSchema = Array.isArray(schema) ? schema : [schema];
const localImageExists = image.startsWith('/') && existsSync(join(process.cwd(), 'public', image.slice(1)));
const resolvedImage = image.startsWith('http') || localImageExists ? image : '/logo.svg';
const fullImageUrl = resolvedImage.startsWith('http') ? resolvedImage : `${siteUrl}${resolvedImage}`;
```

Replace with:
```astro
---
import '../styles/global.css';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import defaultOgImage from '../assets/images/og/calculadora-importaciones.png';

type SchemaNode = Record<string, unknown>;

interface Props {
  title: string;
  description: string;
  image?: ImageMetadata | string;
  imageAlt?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article';
  schema?: SchemaNode | SchemaNode[];
}

const { 
  title, 
  description, 
  image = defaultOgImage,
  imageAlt = 'Calculadora de importaciones',
  url, 
  locale = 'es_AR',
  type = 'website',
  schema = []
} = Astro.props;

const siteTitle = `${title} | Calculadora de Importaciones Argentina`;
const siteUrl = (Astro.site?.href || 'https://calculadoraimportacion.com.ar').replace(/\/$/, '');
const canonicalUrl = url || siteUrl;
const pageSchema = Array.isArray(schema) ? schema : [schema];

let fullImageUrl: string;
let ogImageMeta: { width: number; height: number; type: string } | null = null;

if (typeof image === 'string') {
  fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
} else {
  const optimizedOgImage = await getImage({ src: image, format: 'avif', width: 1200, height: 630 });
  fullImageUrl = `${siteUrl}${optimizedOgImage.src}`;
  ogImageMeta = {
    width: optimizedOgImage.attributes.width,
    height: optimizedOgImage.attributes.height,
    type: 'image/avif',
  };
}
```

- [ ] **Step 2: Add the OG image dimension/type meta tags**

Find (around line 135-150):
```astro
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={fullImageUrl} />
    <meta property="og:image:alt" content={imageAlt} />
    <meta property="og:locale" content={locale} />
    <meta property="og:site_name" content="Calculadora de Importaciones Argentina" />
```

Replace with:
```astro
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={fullImageUrl} />
    <meta property="og:image:alt" content={imageAlt} />
    {ogImageMeta && (
      <>
        <meta property="og:image:width" content={String(ogImageMeta.width)} />
        <meta property="og:image:height" content={String(ogImageMeta.height)} />
        <meta property="og:image:type" content={ogImageMeta.type} />
      </>
    )}
    <meta property="og:locale" content={locale} />
    <meta property="og:site_name" content="Calculadora de Importaciones Argentina" />
```

- [ ] **Step 3: Verify with a type-check**

Run: `npx astro check 2>&1 | grep -i "BaseLayout" || echo "no BaseLayout errors"`

Expected: `no BaseLayout errors` (other pages will still error until later tasks are done — that's fine).

- [ ] Do not commit yet (see Task 8).

---

### Task 4: Update `Hero.astro` to use `<Image>` (LCP image)

**Files:**
- Modify: `src/components/sections/Hero.astro:1-2` (frontmatter)
- Modify: `src/components/sections/Hero.astro:63-68` (`<img>` tag)

This is the hero image — likely the page's LCP element — so it gets `fetchpriority="high"` in addition to AVIF conversion.

- [ ] **Step 1: Add imports to the (currently empty) frontmatter**

Find (lines 1-2):
```astro
---
---
```

Replace with:
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../../assets/images/og/calculadora-importaciones.png';
---
```

- [ ] **Step 2: Replace the `<img>` tag**

Find (lines 63-68):
```astro
          <img
            src="/images/og/calculadora-importaciones.png"
            alt="Planificación de costos de importación"
            class="hero-image"
            loading="eager"
          />
```

Replace with:
```astro
          <Image
            src={heroImage}
            alt="Planificación de costos de importación"
            class="hero-image"
            loading="eager"
            fetchpriority="high"
            format="avif"
            width={1200}
            height={630}
          />
```

- [ ] **Step 3: Verify**

Run: `grep -n "calculadora-importaciones\|astro:assets" src/components/sections/Hero.astro`

Expected: shows the import line and the `<Image src={heroImage} ...>` usage; no remaining `/images/og/` string reference.

- [ ] Do not commit yet (see Task 8).

---

### Task 5: Update `articulos/[slug].astro` (article cover + OG image)

**Files:**
- Modify: `src/pages/articulos/[slug].astro:1-7` (imports)
- Modify: `src/pages/articulos/[slug].astro:27-30` (image resolution logic)
- Modify: `src/pages/articulos/[slug].astro:86-94` (`<BaseLayout>` props)
- Modify: `src/pages/articulos/[slug].astro:135-143` (article cover `<img>`)

- [ ] **Step 1: Update imports**

Find (lines 1-7):
```astro
---
import { getCollection, render } from 'astro:content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
```

Replace with:
```astro
---
import { getCollection, render } from 'astro:content';
import { Image, getImage } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
```

- [ ] **Step 2: Replace the image resolution logic**

Find (lines 27-30):
```astro
const localImageExists = entry.data.image?.startsWith('/') && existsSync(join(process.cwd(), 'public', entry.data.image.slice(1)));
const articleImage = entry.data.image && (entry.data.image.startsWith('http') || localImageExists) ? entry.data.image : '/logo.svg';
const articleImageUrl = articleImage.startsWith('http') ? articleImage : `${siteUrl}${articleImage}`;
const imageAlt = `Imagen representativa de la guía: ${entry.data.title}`;
```

Replace with:
```astro
const articleImage = entry.data.image;
const imageAlt = `Imagen representativa de la guía: ${entry.data.title}`;

let articleImageUrl: string;
if (articleImage) {
  const optimizedArticleImage = await getImage({ src: articleImage, format: 'avif', width: 1200, height: 630 });
  articleImageUrl = `${siteUrl}${optimizedArticleImage.src}`;
} else {
  articleImageUrl = `${siteUrl}/logo.svg`;
}
```

Note: `articleImageUrl` is still used unchanged below in the `BlogPosting` JSON-LD schema (`"image": { "url": articleImageUrl, ... }`) — no change needed there.

- [ ] **Step 3: Update the `<BaseLayout>` `image` prop**

Find (lines 86-94):
```astro
<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  image={articleImage}
  imageAlt={imageAlt}
  type="article"
  schema={schema}
>
```

Replace with:
```astro
<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  image={articleImage ?? '/logo.svg'}
  imageAlt={imageAlt}
  type="article"
  schema={schema}
>
```

- [ ] **Step 4: Replace the article cover `<img>`**

Find (lines 135-143):
```astro
            <div class="p-6 lg:p-10">
              {entry.data.image && (
                <img
                  src={articleImage}
                  alt={imageAlt}
                  class="article-cover"
                  loading="eager"
                />
              )}
```

Replace with:
```astro
            <div class="p-6 lg:p-10">
              {articleImage && (
                <Image
                  src={articleImage}
                  alt={imageAlt}
                  class="article-cover"
                  loading="eager"
                  format="avif"
                  width={1200}
                  height={630}
                />
              )}
```

- [ ] **Step 5: Verify**

Run: `grep -n "existsSync\|node:fs\|node:path" src/pages/articulos/\[slug\].astro || echo "clean"`

Expected: `clean` (no leftover filesystem-check imports).

- [ ] Do not commit yet (see Task 8).

---

### Task 6: Update `articulos/index.astro` (guide thumbnails)

**Files:**
- Modify: `src/pages/articulos/index.astro:1-5` (imports)
- Modify: `src/pages/articulos/index.astro:136-143` (guide cover `<img>`)

- [ ] **Step 1: Add the `Image` import**

Find (lines 1-5):
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
```

Replace with:
```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
```

- [ ] **Step 2: Replace the guide cover `<img>`**

Find (lines 136-143):
```astro
            {guia.image && (
              <img
                src={guia.image}
                alt={`Guía: ${guia.title}`}
                class="guide-cover"
                loading="lazy"
              />
            )}
```

Replace with:
```astro
            {guia.image && (
              <Image
                src={guia.image}
                alt={`Guía: ${guia.title}`}
                class="guide-cover"
                loading="lazy"
                format="avif"
                width={800}
                height={420}
              />
            )}
```

- [ ] **Step 3: Verify**

Run: `grep -n "astro:assets\|<Image" src/pages/articulos/index.astro`

Expected: shows the new import and the `<Image>` usage.

- [ ] Do not commit yet (see Task 8).

---

### Task 7: Update `herramientas-para-negocios.astro` (background-image via `getImage`)

**Files:**
- Modify: `src/pages/herramientas-para-negocios.astro:1-10` (imports + image setup)
- Modify: `src/pages/herramientas-para-negocios.astro:70-80` (`<BaseLayout>` prop + inline `background-image` style)

This page uses the OG image as a CSS `background-image`, not an `<img>`, so it uses `getImage()` directly to get an optimized AVIF URL.

- [ ] **Step 1: Update imports and image setup**

Find (lines 1-10):
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';

const title = "Herramientas para negocios";
const description = "Diseñamos sistemas, dashboards y automatizaciones a medida para ordenar procesos, centralizar información y mejorar la toma de decisiones.";
const siteUrl = (Astro.site?.href || 'https://calculadoraimportacion.com.ar').replace(/\/$/, '');
const image = "/images/og/herramientas-negocios.png";
const imageAlt = "Herramientas digitales para negocios";
```

Replace with:
```astro
---
import { getImage } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import heroToolsImage from '../assets/images/og/herramientas-negocios.png';

const title = "Herramientas para negocios";
const description = "Diseñamos sistemas, dashboards y automatizaciones a medida para ordenar procesos, centralizar información y mejorar la toma de decisiones.";
const siteUrl = (Astro.site?.href || 'https://calculadoraimportacion.com.ar').replace(/\/$/, '');
const optimizedHeroTools = await getImage({ src: heroToolsImage, format: 'avif', width: 1600 });
const imageAlt = "Herramientas digitales para negocios";
```

- [ ] **Step 2: Update `<BaseLayout>` prop and the inline background style**

Find (lines 70-80):
```astro
<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  image={image}
  imageAlt={imageAlt}
  schema={schema}
>
  <Header />
  <main>
    <section class="tools-hero" style={`background-image: linear-gradient(90deg, rgba(0, 27, 77, 0.88), rgba(0, 36, 107, 0.58), rgba(0, 36, 107, 0.16)), url('${image}');`}>
```

Replace with:
```astro
<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  image={heroToolsImage}
  imageAlt={imageAlt}
  schema={schema}
>
  <Header />
  <main>
    <section class="tools-hero" style={`background-image: linear-gradient(90deg, rgba(0, 27, 77, 0.88), rgba(0, 36, 107, 0.58), rgba(0, 36, 107, 0.16)), url('${optimizedHeroTools.src}');`}>
```

- [ ] **Step 3: Verify**

Run: `grep -n "/images/og\|astro:assets\|optimizedHeroTools" src/pages/herramientas-para-negocios.astro`

Expected: no `/images/og` references remain; shows the new import and `optimizedHeroTools` usages.

- [ ] Do not commit yet (see Task 8).

---

### Task 8: Build verification, cleanup, and commit

**Files:**
- None additional — this task verifies the combined result of Tasks 1-7 and creates the single commit.

- [ ] **Step 1: Type-check the whole project**

Run: `npx astro check`

Expected: no errors. If there are errors referencing `entry.data.image` as a string (e.g. `.startsWith` does not exist on type `ImageMetadata`), find and fix the leftover string-style usage per the relevant task above.

- [ ] **Step 2: Build**

Run: `npm run build`

Expected: build completes successfully, prints `[build] Complete!`.

- [ ] **Step 3: Verify AVIF output and absence of old PNG references**

```bash
find dist/_astro -name "*.avif"
grep -rIo "/images/og\|/images/guides" dist/ || echo "no old image paths in dist"
```

Expected: at least 8 distinct `.avif` files (some pages reuse the same source image for both page `<Image>` and OG `getImage()`, which Astro deduplicates by content hash — so the count may be less than the number of `<Image>`/`getImage()` call sites but should be >= 8 unique source images... actually dedupes by output (src+format+width+height) so could be fewer than 8 if e.g. 1200x630 AVIF is reused for both inline and OG for the same source — that's fine). The grep should print `no old image paths in dist`.

- [ ] **Step 4: Compare total image weight**

```bash
du -ch dist/_astro/*.avif | tail -1
```

Expected: total well under 2MB (down from ~15MB of source PNGs), confirming the optimization worked.

- [ ] **Step 5: Spot-check OG meta tags**

```bash
grep -o '<meta property="og:image[^>]*>' dist/index.html
grep -o '<meta property="og:image[^>]*>' dist/articulos/valor-cif-importacion/index.html
```

Expected: each shows `og:image`, `og:image:alt`, `og:image:width`, `og:image:height`, `og:image:type` (`content="image/avif"`), with `og:image` pointing to an absolute `https://calculadoraimportacion.com.ar/_astro/....avif` URL.

- [ ] **Step 6: Commit everything**

```bash
git add -A
git status
```

Review the status output: should show renames (`public/images/... -> src/assets/images/...`) plus modifications to `src/content.config.ts`, the 6 article `.md` files, `src/layouts/BaseLayout.astro`, `src/components/sections/Hero.astro`, `src/pages/articulos/[slug].astro`, `src/pages/articulos/index.astro`, `src/pages/herramientas-para-negocios.astro`.

```bash
git commit -m "$(cat <<'EOF'
perf: migrar imagenes a astro:assets con AVIF

Las imagenes de OG, hero, portadas de articulos y thumbnails de guias
(PNG ~1.7-2MB cada una, ~15MB en total) ahora se procesan con el
pipeline de astro:assets en build time: se convierten a AVIF y se
redimensionan al tamano real de despliegue. Se agregan ademas los
meta tags og:image:width/height/type, ausentes hasta ahora.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Final verification**

Run: `git log -1 --stat`

Expected: shows the new commit with the renamed/modified files listed above.

---

## Self-Review Notes

- **Spec coverage:** AVIF format ✓ (Tasks 3-7), `og:image:width/height/type` ✓ (Task 3), `alt` text preserved unchanged on every `<Image>` ✓ (Tasks 4-6), content collection `image()` schema ✓ (Task 2), file moves ✓ (Task 1), build/cleanup/commit ✓ (Task 8).
- **Type consistency:** `entry.data.image` is `ImageMetadata | undefined` after Task 2; Task 5 and Task 6 both treat it that way (`articleImage`/`guia.image` checked with `&&` before use, never called with string methods).
- **No fallback hacks introduced:** the only fallback (`'/logo.svg'` for articles without a cover image) preserves pre-existing behavior and is handled by `BaseLayout`'s existing string branch.
