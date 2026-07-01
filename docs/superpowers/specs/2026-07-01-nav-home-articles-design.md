# Diseño: Nav dropdown + Home selector + 4 artículos

**Fecha:** 2026-07-01  
**Proyecto:** calculadoraimportacion.com.ar  
**Rama:** feat/courier-calculator  
**Estado:** Aprobado por Kaled

---

## Contexto

La calculadora courier (`/calculadora/courier`) está implementada pero no es discoverable desde el nav ni desde el home. Este PR agrega:
1. Dropdown en el nav para seleccionar calculadora
2. Sección en el home para elegir entre cálculo personal/comercial
3. 4 artículos de soporte conceptual con investigación web + prompts de imagen

---

## Alcance

### Archivos modificados
| Archivo | Cambio |
|---|---|
| `src/components/layout/Header.astro` | Dropdown "Calculadoras" con 2 subitems |
| `src/pages/index.astro` | Nueva sección "¿Para qué importás?" después del Hero |

### Archivos nuevos
| Archivo | Contenido |
|---|---|
| `src/content/articulos/tasa-estadistica-importaciones-argentina.md` | Artículo tasa estadística |
| `src/content/articulos/iva-importaciones-argentina.md` | Artículo IVA en importaciones |
| `src/content/articulos/derecho-antidumping-importaciones.md` | Artículo derecho antidumping |
| `src/content/articulos/courier-privado-vs-correo-argentino.md` | Artículo comparación canales |
| `src/assets/images/guides/tasa-estadistica-importaciones-argentina.png` | Imagen placeholder (generada por IA) |
| `src/assets/images/guides/iva-importaciones-argentina.png` | Imagen placeholder |
| `src/assets/images/guides/derecho-antidumping-importaciones.png` | Imagen placeholder |
| `src/assets/images/guides/courier-privado-vs-correo-argentino.png` | Imagen placeholder |

---

## 1. Nav dropdown — `Header.astro`

### Comportamiento

El item "Calculadora" (`/calculadora`) se reemplaza por un grupo "Calculadoras" con dropdown:

```
Calculadoras ▾
├── Importación formal        →  /calculadora
└── Courier / Puerta a puerta →  /calculadora/courier
```

### Desktop

- El trigger es el texto "Calculadoras" con un chevron `▾`
- Dropdown aparece en hover (CSS puro con `group-hover`) — sin JS nuevo
- Panel blanco, `border border-[#DDE6F2]`, `rounded-lg`, `shadow-md`, posición `absolute` bajo el trigger
- Cada subitem: icono pequeño + label + descripción breve de una línea
  - **Importación formal** — "Aranceles, IVA, tasa estadística y despacho"
  - **Courier / Puerta a puerta** — "Compras online, franquicia USD 400"
- Active state del trigger: borde azul inferior si `currentPath.startsWith('/calculadora')`
- Active state del subitem: texto azul si es la ruta exacta

### Mobile

- En el mobile menu, "Calculadoras" aparece como item no-link (sin href) con chevron
- Al tocar expande/colapsa los 2 subitems indentados (`pl-6`)
- Reutiliza el script `setMenuOpen` existente — se agrega toggle de accordion con JS inline mínimo

### Implementación técnica

Cambiar `navItems` de array de `{href, label}` a array que soporta `children` opcional:

```typescript
type NavItem =
  | { href: string; label: string; children?: never }
  | { href?: never; label: string; children: { href: string; label: string; description: string }[] };
```

El template actual con `navItems.map(...)` se extiende para renderizar el grupo con dropdown cuando `item.children` existe.

---

## 2. Sección "¿Para qué importás?" — `index.astro`

### Posición

Justo después de `<Hero />`, antes de la sección `.gist-strip`.

### Estructura HTML

```
<section> (padding 56px 0, background #fff)
  <eyebrow> "¿Qué tipo de importación necesitás calcular?"
  <grid 2 columnas> (gap-6, 1 columna en mobile)
    <card> Compras personales del exterior
    <card> Importación comercial o empresarial
```

### Card 1 — Compras personales (courier)

- Badge: "Más buscado" (verde `#16A34A` bg `#DCFCE7`)
- Título: "Compras personales del exterior"
- Descripción: "Shein, Temu, AliExpress, compras online. Franquicia de USD 400, hasta 5 envíos por año."
- CTA: `<a href="/calculadora/courier">Calculadora courier →</a>` (botón primario)
- Icono: caja/paquete

### Card 2 — Importación formal

- Sin badge
- Título: "Importación comercial o empresarial"
- Descripción: "Materias primas, productos para reventa, equipamiento. Aranceles según NCM, despacho aduanero."
- CTA: `<a href="/calculadora">Calculadora de importación →</a>` (botón outline)
- Icono: contenedor/barco

### Estilo de cards

- `bg-white border border-[#DDE6F2] rounded-xl p-8`
- Hover: `hover:shadow-md hover:border-[#0074D9]` con `transition`
- Sin link wrapper en el card completo — solo el botón CTA es clickeable (evita conflicto de accesibilidad)

---

## 3. Los 4 artículos

### Estructura de cada artículo

```markdown
---
title: "..."
date: 2026-07-01
category: "Impuestos" | "Courier"
image: "../../assets/images/guides/<slug>.png"
description: "..."
author: "Equipo de GIST POINT"
tags: [...]
---
```

Secciones obligatorias en cada artículo:
1. Introducción: qué es el concepto en palabras simples (sin jerga)
2. Cómo funciona / reglas vigentes en Argentina 2026
3. Ejemplo numérico con la calculadora
4. Cuándo aplica / cuándo no aplica
5. Preguntas frecuentes (2-3 Q&As)
6. CTA al calculador correspondiente

El contenido debe ser investigado desde fuentes web oficiales (ARCA, InfoLEG, normativa vigente) — no generado solo desde memoria del modelo.

---

### Artículo 1: Tasa estadística

- **Slug:** `tasa-estadistica-importaciones-argentina`
- **Título:** "¿Qué es la tasa estadística en importaciones? Guía 2026"
- **Description:** "La tasa estadística es un tributo del 0,5% sobre el valor CIF que se paga en importaciones formales en Argentina. Entendé cuándo aplica, sus topes y cómo aparece en la calculadora."
- **Tags:** `["tasa estadística", "impuestos importación", "aduana Argentina", "ARCA"]`
- **CTA final:** link a `/calculadora`
- **Fuentes a investigar:** Decreto 690/2002, resoluciones ARCA/AFIP vigentes, topes por monto

**Prompt de imagen:**
```
Professional flat illustration, wide format (1200x630). Subject: a small percentage symbol (0.5%) overlaid on a customs document or shipping manifest, with Argentine flag colors (light blue and white) as accent. Clean government/finance aesthetic. No text in the image. Background: soft light gray gradient. Style: modern infographic illustration, not photorealistic.
```

---

### Artículo 2: IVA en importaciones

- **Slug:** `iva-importaciones-argentina`
- **Título:** "IVA en importaciones: por qué pagás más del 21% en Argentina"
- **Description:** "Al importar en Argentina pagás IVA del 21% más un IVA adicional del 10,5% o 20%. Entendé cómo se calcula la base imponible, qué es el IVA adicional y cuándo aplican las percepciones."
- **Tags:** `["IVA importaciones", "IVA adicional", "percepciones", "aduana Argentina"]`
- **CTA final:** link a `/calculadora`
- **Fuentes a investigar:** Ley 23.349 (IVA), Resolución General ARCA sobre percepciones, tasas IVA adicional vigentes

**Prompt de imagen:**
```
Professional flat illustration, wide format (1200x630). Subject: a tax receipt or invoice showing layered percentages stacking upward (21% + additional %), with a subtle customs/border gate in the background. Argentine-inspired color palette (blue tones). Clean finance aesthetic. No text in the image. Background: white to light blue gradient. Style: modern flat vector illustration.
```

---

### Artículo 3: Derecho antidumping

- **Slug:** `derecho-antidumping-importaciones`
- **Título:** "¿Qué es el derecho antidumping en importaciones?"
- **Description:** "El derecho antidumping es un recargo aduanero que Argentina aplica a productos importados a precios artificialmente bajos. Entendé cuándo aplica, cómo consultarlo y cómo afecta el costo de tu importación."
- **Tags:** `["antidumping", "derechos aduaneros", "importación Argentina", "ARCA"]`
- **CTA final:** link a `/calculadora`
- **Fuentes a investigar:** Ley 24.425 (GATT/OMC antidumping), resoluciones ARCA vigentes, base de datos antidumping Argentina

**Prompt de imagen:**
```
Professional flat illustration, wide format (1200x630). Subject: a balance scale with a box of imported goods on one side and Argentine pesos/currency symbol on the other, slightly unbalanced, representing price distortion. Shield or protective element in background suggesting trade defense. Blue and navy color palette. No text in the image. Style: clean modern flat illustration.
```

---

### Artículo 4: Courier privado vs Correo Argentino

- **Slug:** `courier-privado-vs-correo-argentino`
- **Título:** "Courier privado vs Correo Argentino: diferencias, costos y cuándo usar cada uno"
- **Description:** "DHL, FedEx y UPS tienen franquicia de USD 400 con IVA 21%. Correo Argentino tiene franquicia de USD 50 sin IVA. Comparación completa de ambos canales para compras del exterior en Argentina 2026."
- **Tags:** `["courier privado", "Correo Argentino", "DHL FedEx UPS", "compras del exterior", "franquicia"]`
- **CTA final:** link a `/calculadora/courier`
- **Fuentes a investigar:** Decreto 1065/2024 (courier privado), portal ARCA envíos internacionales, tarifas Correo Argentino

**Prompt de imagen:**
```
Professional flat illustration, wide format (1200x630). Subject: two delivery vans or couriers side by side — one labeled as private (DHL-style red/yellow, generic) and one as postal service (blue/yellow, Argentine postal aesthetic) — with small package icons and dollar amounts (USD 400 vs USD 50) as floating labels. No logos, generic vehicles only. No text in the image except the USD amounts as part of the illustration. Style: friendly flat vector illustration, vibrant but professional.
```

---

## Verificación (cómo testear)

1. `npm run build` — debe pasar, 22 páginas (18 actuales + 4 artículos)
2. Inspeccionar nav en desktop: hover sobre "Calculadoras" abre dropdown con 2 opciones
3. Inspeccionar nav en mobile: "Calculadoras" expande subitems
4. Active state: navegar a `/calculadora/courier` → "Calculadoras" muestra borde azul
5. Home: sección de 2 cards aparece inmediatamente después del hero
6. Badge "Más buscado" visible en card courier
7. Artículos aparecen en `/blog` con sus categorías correctas
8. Cada artículo linkea al calculador correspondiente en su CTA final

---

## Decisiones de diseño

- El dropdown usa CSS hover puro en desktop para evitar JS adicional; el accordion mobile agrega JS mínimo inline
- No se usa link wrapper en los cards del home (accesibilidad — evita botón dentro de link)
- Los artículos son investigados desde fuentes web para asegurar precisión normativa 2026
- Las imágenes son generadas por IA con los prompts incluidos; deben tener dimensiones 1200×630 (aspect ratio blog)
- La sección home no reemplaza el Hero existente — se inserta como sección independiente
