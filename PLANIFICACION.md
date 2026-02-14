# Planificación del Proyecto: Calculadora de Importaciones

## 📋 Resumen del Proyecto
**Nombre:** Calculadora de Importaciones Argentina  
**Tecnologías:** Astro 5.x + React 19 + TypeScript  
**Plataforma:** Cloudflare Pages  
**Idioma:** Español (Argentina)  
**Dominio objetivo:** Público argentino (importadores, despachantes, comerciantes)

---

## 🎯 Objetivos Principales

1. **Calculadora funcional:** Calcular costos de importación (impuestos, aranceles, etc.)
2. **SEO optimizado:** Posicionamiento en búsquedas argentinas
3. **Performance excelente:** Core Web Vitals en verde
4. **Mantenible:** Componentes reutilizables y contenido en markdown
5. **Escalable:** Fácil de extender con nuevas funcionalidades

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
calc/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Layout.astro
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.astro
│   │   │   └── Logo.tsx
│   │   ├── calculator/
│   │   │   ├── ImportCalculator.tsx
│   │   │   ├── CurrencyInput.tsx
│   │   │   └── ResultsPanel.tsx
│   │   └── sections/
│   │       ├── Hero.astro
│   │       ├── HowItWorks.astro
│   │       ├── NewsSection.astro
│   │       └── CTAContact.astro
│   ├── content/
│   │   ├── news/
│   │   │   ├── 2024-01-01-nueva-reglamentacion.md
│   │   │   └── 2024-02-15-cambios-dolar.md
│   │   └── config/
│   │       └── navigation.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── calculadora/
│   │   │   └── index.astro
│   │   ├── noticias/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── mas-informacion.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── logo.svg
│   ├── favicon.svg
│   └── images/
├── scripts/
│   └── deploy-cloudflare.js
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🚀 Estrategia de Desarrollo

### Fase 1: Setup Inicial (Día 1)
1. **Crear proyecto Astro**
   ```bash
   npm create astro@latest . -- --template minimal --typescript strict
   ```

2. **Instalar dependencias**
   ```bash
   npm install @astrojs/react @astrojs/tailwind @types/react @types/react-dom
   npm install react react-dom lucide-react
   ```

3. **Configurar integraciones**
   - React integration en `astro.config.mjs`
   - Tailwind CSS
   - TypeScript strict mode

4. **Configurar Git workflow**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Fase 2: Componentes Base (Día 2-3)
1. **Layout System**
   - `BaseLayout.astro` con SEO base
   - `Header.astro` con navegación
   - `Footer.astro` con CTA

2. **UI Components**
   - `Logo.tsx` (SVG dinámico con cambio de color)
   - `Button.tsx` (variantes: primary, secondary, outline)
   - `Card.astro` (para noticias y secciones)

3. **Secciones Principales**
   - `Hero.astro` con título, descripción y 2 CTAs
   - `HowItWorks.astro` con pasos e imagen
   - `CTAContact.astro` con formulario/contacto

### Fase 3: Calculadora (Día 4-6)
1. **Lógica de Negocio**
   - Componente principal `ImportCalculator.tsx`
   - Inputs: valor mercadería, tipo de producto, origen
   - Cálculos: derechos, IVA, estadística, etc.
   - Resultados en tiempo real

2. **Componentes React**
   - `CurrencyInput.tsx` (con formato ARS)
   - `ResultsPanel.tsx` (desglose de costos)
   - `ProductSelector.tsx` (categorías arancelarias)

### Fase 4: Sistema de Noticias (Día 7-8)
1. **Content Collections**
   - Configurar `src/content/config.ts`
   - Crear schema para noticias
   - Soporte para imágenes y videos

2. **Páginas de Noticias**
   - Listado en `/noticias/`
   - Artículo individual `/noticias/[slug]/`
   - Paginación y filtros

### Fase 5: SEO y Performance (Día 9-10)
1. **Meta Tags**
   - Title, description en español
   - Open Graph (Facebook, WhatsApp)
   - Twitter Cards
   - JSON-LD Schema.org

2. **Optimizaciones**
   - Imágenes con `astro:assets`
   - Fonts locales
   - Sitemap y robots.txt
   - Core Web Vitals

### Fase 6: Despliegue (Día 11)
1. **Cloudflare Pages**
   - Conectar repositorio GitHub
   - Configurar build settings
   - Dominio personalizado
   - SSL automático

2. **Testing**
   - Lighthouse CI
   - Mobile responsive
   - Cross-browser

---

## 🔧 Configuración Técnica

### astro.config.mjs
```javascript
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
```

### tailwind.config.mjs
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#003366',    // Azul corporativo
        secondary: '#0066CC',
        accent: '#FF6600'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

---

## 🎨 Componentes Detallados

### 1. Logo.tsx (SVG Dinámico)
```tsx
interface LogoProps {
  className?: string;
  color?: string; // '#003366' o 'currentColor'
  width?: number;
}

export const Logo = ({ className, color = '#003366', width = 200 }: LogoProps) => {
  return (
    <svg 
      width={width} 
      viewBox="0 0 960 1088" 
      className={className}
      fill={color}
    >
      {/* Paths del logo.svg */}
    </svg>
  );
};
```

### 2. Header.astro
- **Navegación:** Inicio | Calculadora | Noticias | Más Info
- **Logo:** SVG con color dinámico
- **Mobile:** Menú hamburguesa
- **SEO:** Nav accesible

### 3. Hero.astro
- **Título:** "Calculá los costos de importación al instante"
- **Descripción:** 2-3 líneas sobre beneficios
- **CTAs:**
  - Primario: "Probar calculadora" → `/calculadora/`
  - Secundario: "Solicitar asesoramiento" → `#contacto`
- **Imagen:** Ilustración de contenedores/aduana

### 4. ImportCalculator.tsx
**Inputs:**
- Valor FOB (USD)
- Peso/volumen
- Categoría arancelaria (select)
- Origen (select)
- Tipo de transporte

**Cálculos (ejemplo):**
- Derechos (0-35% según categoría)
- IVA (21%)
- Estadística (0.5%)
- Tasa de gestión

**Outputs:**
- Costo total en ARS
- Desglose detallado
- Tiempo estimado

### 5. NewsSection.astro
- **Grid:** 3 columnas en desktop
- **Cards:** Imagen + título + fecha + extracto
- **Paginación:** 9 noticias por página
- **Filtros:** Por año, categoría

---

## 🔍 SEO Estrategia (Español - Argentina)

### Keywords Principales
- "calculadora importaciones argentina"
- "costos importar argentina"
- "aranceles aduaneros argentina"
- "despacho aduanero"
- "importar productos argentina"

### Meta Tags Base
```astro
---
const title = "Calculadora de Importaciones Argentina | Costos Aduaneros";
const description = "Calculá al instante los costos de importación en Argentina. Derechos, aranceles, IVA y más. Herramienta gratuita para importadores y despachantes.";
const image = "/images/og-image.jpg";
const url = "https://tudominio.com";
---

<BaseLayout 
  title={title}
  description={description}
  image={image}
  url={url}
  locale="es_AR"
>
```

### Schema.org JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Calculadora de Importaciones Argentina",
  "description": "Calculadora gratuita de costos de importación",
  "applicationCategory": "FinanceApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ARS"
  },
  "inLanguage": "es-AR",
  "areaServed": {
    "@type": "Country",
    "name": "Argentina"
  }
}
```

### URLs Optimizadas
- `/` → Home
- `/calculadora/` → Calculadora
- `/noticias/` → Noticias
- `/noticias/nueva-reglamentacion-aduanera-2024/` → Artículo individual
- `/mas-informacion/` → Info adicional

---

## 📦 Git Workflow

### Ramas
- `main` → Producción (Cloudflare Pages)
- `develop` → Pre-producción (opcional)
- `feature/nombre-feature` → Features individuales

### Proceso de Trabajo
```bash
# 1. Nueva feature
git checkout -b feature/calculadora-basica

# 2. Desarrollar y commitear
npm run dev
# ... desarrollo ...
git add .
git commit -m "feat: componente de calculadora con inputs base"

# 3. Push y PR
git push origin feature/calculadora-basica
# Crear Pull Request en GitHub

# 4. Merge a main
git checkout main
git merge feature/calculadora-basica
git push origin main
# Deploy automático a Cloudflare Pages
```

### Conventional Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Estilos/CSS
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Configuración

---

## ☁️ Cloudflare Pages Setup

### 1. Conectar Repositorio
- Ir a Cloudflare Dashboard → Pages
- "Connect to Git"
- Seleccionar repositorio de GitHub

### 2. Build Settings
```yaml
Framework preset: Astro
Build command: npm run build
Build output directory: /dist
Node.js version: 20
```

### 3. Variables de Entorno (opcional)
```env
PUBLIC_CONTACT_EMAIL=contacto@tudominio.com
PUBLIC_API_URL=https://api.tudominio.com
```

### 4. Dominio Personalizado
- Configurar DNS en Cloudflare
- Añadir dominio personalizado en Pages
- SSL automático (Full Strict)

### 5. Preview Deployments
- Cada PR genera preview URL
- Testing antes de merge a main

---

## 📱 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **FCP (First Contentful Paint):** < 1.8s
- **Speed Index:** < 3.4s

### Optimizaciones
1. **Imágenes:** `astro:assets` con WebP/AVIF
2. **Fonts:** Self-host Inter font
3. **CSS:** Inline critical CSS
4. **JS:** React solo en componentes interactivos
5. **Prefetch:** `<link rel="prefetch">` para calculadora

---

## 📝 Guía de Contenido

### Noticias (Markdown)
```markdown
---
title: "Nueva reglamentación aduanera 2024"
date: 2024-01-15
category: "regulaciones"
image: "/images/news/aduana-2024.jpg"
tags: ["aduana", "aranceles", "2024"]
description: "Cambios en los procedimientos de importación"
author: "Equipo de Importaciones"
---

Contenido de la noticia con **negritas** y *cursivas*.

## Subtítulo

Puede incluir imágenes:

![Descripción](/images/news/imagen.jpg)

Y videos:

<video controls>
  <source src="/videos/tutorial.mp4" type="video/mp4">
</video>
```

### Schema para Noticias
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.enum(['regulaciones', 'impuestos', 'logistica', 'tips']),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string(),
    author: z.string().default('Equipo'),
  })
});

export const collections = {
  news: newsCollection,
};
```

---

## 🎨 Paleta de Colores (Argentina)

### Primarios
- **Azul Marino:** `#003366` (header, botones)
- **Azul Claro:** `#0066CC` (links, hover)
- **Celeste:** `#4A90E2` (acentos)

### Secundarios
- **Naranja:** `#FF6600` (CTA principal)
- **Gris Oscuro:** `#333333` (texto)
- **Gris Claro:** `#F5F5F5` (fondos)
- **Blanco:** `#FFFFFF` (fondos)

### Semánticos
- **Éxito:** `#28A745`
- **Advertencia:** `#FFC107`
- **Error:** `#DC3545`
- **Info:** `#17A2B8`

---

## 🔒 Seguridad y Mejores Prácticas

### .gitignore
```gitignore
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### Seguridad
- No exponer keys en el frontend
- Validar inputs en calculadora
- Sanitizar contenido markdown
- Headers de seguridad en Cloudflare

### Accesibilidad (a11y)
- Contrast ratio WCAG AA
- Navegación por teclado
- Alt text en imágenes
- ARIA labels en formularios
- Screen reader friendly

---

## 📊 Analytics y Tracking

### Opciones (configurar post-launch)
1. **Plausible Analytics** (GDPR-friendly)
2. **Cloudflare Web Analytics**
3. **Google Analytics 4** (con consentimiento)

### Eventos a trackear
- Uso de calculadora
- Clics en CTAs
- Lectura de noticias
- Scroll depth

---

## 🚀 Próximos Features (Post-MVP)

1. **Login/Registro:** Guardar cálculos
2. **PDF Export:** Exportar desglose
3. **API AFIP:** Tasas en tiempo real
4. **Newsletter:** Suscripción a noticias
5. **Chatbot:** Asistencia IA
6. **Multi-idioma:** Portugués (Mercosur)

---

## 📞 Contacto y Soporte

### Información de Contacto
- **Email:** contacto@tudominio.com
- **Teléfono:** +54 11 XXXX-XXXX
- **Dirección:** [Tu dirección comercial]
- **Horario:** Lun-Vie 9-18hs

### Redes Sociales
- LinkedIn
- Twitter/X
- Facebook

---

## ✅ Checklist Pre-Launch

- [ ] Logo SVG funcional en todos los fondos
- [ ] Calculadora con cálculos correctos
- [ ] Mínimo 5 noticias de ejemplo
- [ ] Meta tags SEO en todas las páginas
- [ ] Schema.org JSON-LD
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Favicon en múltiples tamaños
- [ ] Open Graph image (1200x630)
- [ ] Twitter Card image
- [ ] Mobile responsive test
- [ ] Lighthouse score >90
- [ ] Cross-browser test (Chrome, Firefox, Safari)
- [ ] Formularios funcionando
- [ ] 404 page custom
- [ ] Loading states
- [ ] Error boundaries
- [ ] Analytics configurado
- [ ] Cloudflare Pages deploy exitoso
- [ ] Dominio personalizado configurado
- [ ] SSL activo
- [ ] README.md actualizado
- [ ] Licencia OSS (MIT/Apache)

---

**Documento creado:** 13 de febrero de 2026  
**Última actualización:** [Por actualizar]  
**Versión:** 1.0.0
