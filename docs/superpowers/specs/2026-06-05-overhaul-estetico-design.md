# Spec: Overhaul estético — Propuesta 4

**Fecha:** 2026-06-05

## Objetivo

Reemplazar la estética actual (gradiente azul, emojis, title case, sombras fuertes) por un diseño de herramienta financiera profesional: fondo blanco/gris muy claro, tipografía limpia, paleta azul GIST POINT, sin emojis, íconos SVG lineales.

---

## 1. Sistema de diseño (`src/styles/global.css`)

### Colores — reemplazar variables actuales

```css
@theme {
  /* Paleta GP — reemplaza primary/secondary/accent */
  --color-gp-navy:        #00246B;
  --color-gp-blue:        #0074D9;
  --color-gp-blue-dark:   #001B4D;
  --color-gp-aqua:        #8FE3D5;

  --color-gp-bg:          #F8FAFC;
  --color-gp-surface:     #FFFFFF;
  --color-gp-surface-soft:#F3F7FC;

  --color-gp-text:        #081C3A;
  --color-gp-text-muted:  #5D6B82;
  --color-gp-border:      #DDE6F2;

  --font-sans: "Inter", system-ui, sans-serif;
}
```

**Mantener** `--color-primary: #003366` y `--color-secondary: #0066CC` como aliases — los prose styles de artículos los usan.

**`--color-accent: #FF6600`**: se elimina el uso naranja. Cualquier `text-accent`, `bg-accent`, `border-accent` o `hover:bg-orange-*` que aparezca en los archivos del mapa debe migrar a `text-[#0074D9]` / `bg-[#001B4D]` / `border-[#DDE6F2]` según contexto. El único lugar donde se puede conservar temporalmente es en el prose de artículos (`--tw-prose-links`, `--tw-prose-bullets`) — pero se actualizará al mismo tiempo (ver §7).

### Componentes globales

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200;
    text-transform: none;
  }
  .btn-primary {
    background: var(--color-gp-blue-dark);
    color: #fff;
    box-shadow: 0 10px 24px rgba(0,36,107,0.18);
  }
  .btn-primary:hover { background: var(--color-gp-navy); }

  .btn-secondary {
    background: #fff;
    color: var(--color-gp-navy);
    border: 1px solid var(--color-gp-border);
  }
  .btn-secondary:hover { background: var(--color-gp-surface-soft); }
}
```

### Regla tipográfica global

```css
@layer base {
  h1, h2, h3, h4, button, nav a {
    text-transform: none;
  }
}
```

---

## 2. Header (`src/components/layout/Header.astro`)

### Cambios respecto al actual

| Elemento | Actual | Propuesta |
|---|---|---|
| Altura | h-20 (80px) | 76px fijo |
| Fondo | bg-white shadow-sm | `rgba(255,255,255,0.92)` + `backdrop-blur-sm` + border-bottom |
| Logo box | `bg-primary p-2 rounded-lg` con logo invertido | Logo directo sobre blanco, sin caja de color |
| Subtítulo logo | "Tu aliado tecnológico" | Eliminado |
| Nav activo | `text-white bg-primary` (pill azul) | `color: gp-blue; border-bottom: 2px solid gp-blue; pb-[26px]` (underline) |
| Nav hover | `hover:bg-gray-100` | `hover:text-[gp-blue]`, sin background |
| Botón CTA nav | No existe | Agregar "Solicitar asesoramiento" con estilo `.btn-primary` (14px, padding reducido) |
| WhatsApp ícono | `text-gray-600 hover:text-green-600` | Mantener igual |

### Estructura HTML propuesta (desktop)

```
[Logo SVG sin caja] [GIST POINT]   [calculadora] [guías] [asesoramiento] [WA icon] [btn: solicitar asesoramiento]
```

### Mobile

- Hamburger mantiene funcionalidad actual
- Menú mobile: fondo blanco, border-top, mismos links + WhatsApp
- Sin el botón CTA en mobile (ocupa demasiado espacio)

---

## 3. Hero (`src/components/sections/Hero.astro`) — reescritura completa

### Layout

- Fondo: `var(--color-gp-bg)` (no más gradiente azul)
- Grid: `grid-template-columns: 0.9fr 1.1fr`, gap 64px, `padding: 88px 0 48px`
- Mobile (≤900px): una columna, ejemplo abajo

### Columna izquierda

```html
<div class="eyebrow">Herramienta gratuita · Argentina</div>
<h1>Calculá el costo total de tu importación, con precisión</h1>
<p>Estimá todos los costos asociados a tu importación en segundos y tomá mejores decisiones para tu negocio.</p>

<!-- 3 beneficios con íconos SVG inline -->
<div class="benefit-list">
  <div class="benefit-item">
    [ícono: activity/signal]
    <div>
      <h3>Cálculo preciso</h3>
      <p>Todos los costos en un solo lugar</p>
    </div>
  </div>
  <div class="benefit-item">
    [ícono: lock]
    <div>
      <h3>Datos seguros</h3>
      <p>Tu información está protegida</p>
    </div>
  </div>
  <div class="benefit-item">
    [ícono: clock]
    <div>
      <h3>Resultados inmediatos</h3>
      <p>Obtené tu estimación al instante</p>
    </div>
  </div>
</div>
```

### Columna derecha — ejemplo estático (opción C)

Card con valores ilustrativos fijos. **No hay formulario ni lógica de cálculo aquí.**

```html
<div class="calculator-card">
  <div class="card-label">Ejemplo de estimación</div>
  <div class="example-rows">
    Valor FOB .............. USD 10.000
    Flete y seguro ......... USD 1.200
    Aranceles .............. USD 1.320
    Impuestos .............. USD 2.530
    Gastos operativos ...... USD 680
    ─────────────────────────────
    Total estimado ......... ARS 16.940.000
  </div>
  <div class="disclaimer">
    Ejemplo con valores ilustrativos · tasa USD 1.100
  </div>
  <a href="/calculadora" class="btn btn-primary" style="width:100%; margin-top:16px; text-align:center">
    Ir a la calculadora →
  </a>
</div>
```

Estilo del card: `border: 1px solid var(--color-gp-border)`, `border-radius: 22px`, `padding: 32px`, `box-shadow: var(--gp-shadow)`.

Los valores de la tabla en color `gp-blue` (dark para labels, blue para valores numéricos). La fila total tiene tamaño de fuente mayor y peso 700.

---

## 4. Landing page (`src/pages/index.astro`) — nueva estructura de secciones

### Secciones (orden final)

| # | Sección | Estado | Descripción |
|---|---|---|---|
| 1 | Hero | Reescritura (ver §3) | |
| 2 | Costos que incluye | Nueva | 4 ítems con íconos lineales |
| 3 | Tomá decisiones con números reales | Nueva | 2 col texto + tabla ejemplo |
| 4 | Información clave | Simplificada | 4 cards sin emojis (de 6 a 4) |
| 5 | CTA final | Rediseñada | Gradiente azul oscuro redondeado |

### Sección 2 — "Costos que incluye esta estimación"

`padding: 48px 0`, fondo `var(--color-gp-bg)`. Grid 4 columnas (mobile: 2 col, luego 1 col).

4 ítems:
- **Aranceles de importación** — según clasificación y origen — ícono: `percent`
- **Impuestos** — IVA, percepción de ganancias y otros tributos — ícono: `file-text`
- **Costos logísticos** — flete internacional y seguro — ícono: `truck`
- **Gastos operativos** — despacho, honorarios y costos portuarios — ícono: `building`

Cada ítem: `grid-template-columns: 48px 1fr`, ícono en `background: var(--color-gp-surface-soft)`, título 15px bold, descripción 14px muted.

### Sección 3 — "Tomá decisiones con números reales"

`padding: 72px 0`, `background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)`. Grid `0.85fr 1.15fr`.

**Columna izquierda:**
```
Tomá decisiones con números reales

Nuestra calculadora te brinda una estimación completa y detallada
para que planifiques tu importación con confianza.

✓ Estimaciones basadas en datos actualizados
✓ Cálculo de todos los costos relevantes
✓ Herramienta rápida, clara y confiable
```
Los checkmarks usan el color `gp-blue`. Texto sin emojis.

**Columna derecha:** card con tabla idéntica al ejemplo del hero pero con más padding y sin el botón CTA.

### Sección 4 — "Información clave" (simplificada de 6 → 4 cards)

Reducir a las 4 más relevantes para SEO de importaciones:
- **Despacho aduanero** — proceso, NCM, documentación
- **Impuestos a la importación** — aranceles, IVA, percepciones
- **Logística y transporte** — marítimo, aéreo, Incoterms
- **Normativa y compliance** — ARCA, SENASA, restricciones

Sin emojis en los títulos. Cards con `border: 1px solid var(--color-gp-border)`, `border-radius: 12px`, sin background de color (fondo blanco). Título en `gp-navy`, descripción en `gp-text-muted`.

### Sección 5 — CTA final (rediseñada)

```css
.cta-wrapper {
  padding: 64px 0;
  background: var(--color-gp-bg);
}
.cta-card {
  background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);
  border-radius: 18px;
  padding: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

Texto:
```
¿Necesitás acompañamiento para tu importación?
Nuestro equipo puede ayudarte a analizar tu caso particular
y optimizar cada etapa del proceso.
[btn: Solicitar asesoramiento →]
```
Botón: fondo blanco, texto `gp-navy`, sin emojis. Mobile: flex-col.

---

## 5. Página calculadora (`src/pages/calculadora/index.astro`)

### Wrapper

- Fondo página: `var(--color-gp-bg)` en lugar de `bg-gray-50`
- H1: "Calculadora de importaciones" (ya está en sentence case)
- Descripción: mantener texto actual, actualizar colores a `gp-text-muted`
- Info section inferior: actualizar colores, remover emojis de labels y bullets

### Componente `ImportCalculator.tsx` — restyling

**No modificar la lógica de cálculo.** Solo actualizar clases CSS.

Cambios sistemáticos:

| Actual | Propuesta |
|---|---|
| `bg-green-50 border-green-200` (card resultado importación) | `bg-[#F3F7FC] border-[#DDE6F2]` |
| `bg-blue-50 border-blue-200` (distribución costos) | `bg-[#F3F7FC] border-[#DDE6F2]` |
| `bg-purple-50 border-purple-200` (card análisis venta) | `bg-[#F3F7FC] border-[#DDE6F2]` |
| `focus:ring-accent` (inputs) | `focus:ring-[#0074D9]` |
| `border-accent` (tab activo) | `border-[#0074D9]` |
| `text-accent` (tab activo) | `text-[#0074D9]` |
| `text-primary` (subtítulos secciones) | `text-[#00246B]` |
| `text-orange-600` (valores arancel) | `text-[#0074D9]` |
| `text-red-600` (valores impuestos) | `text-[#0074D9]` |
| `bg-green-600 text-white` (badge multiplicador) | `bg-[#00246B] text-white` |
| `bg-green-100 ... text-green-900` (fila total importación) | `bg-[#F3F7FC] ... text-[#081C3A]` |
| `bg-purple-100 ... text-purple-900` (fila total venta) | `bg-[#F3F7FC] ... text-[#081C3A]` |
| `text-green-600` (margen neto en venta) | `text-[#0074D9]` |
| Emojis en tab labels (📦, 💰) | Sin emoji: "Costos de importación", "Precio de venta" |
| Emojis en h3 (📊, 💼, ✅, 💰) | Sin emoji: "Datos de importación", "Datos de venta", "Resumen de costos", "Análisis de venta" |

Inputs/selects: mantener estilo actual pero `border-gray-300` → `border-[#DDE6F2]`, `border-gray-200` → `border-[#DDE6F2]`.

---

## 6. Página de contacto (`src/pages/contacto.astro`)

- Fondo página: `var(--color-gp-bg)`
- H1: sentence case (ya lo está)
- Card del formulario: `border: 1px solid var(--color-gp-border)`, `border-radius: 18px`
- Inputs: `border-[#DDE6F2]`, `focus:ring-[#0074D9]`
- Botón submit: `.btn-primary` con nuevos colores
- Remover cualquier emoji remanente

---

## 7. Páginas de artículos

### `src/pages/articulos/index.astro`
- Fondo: `var(--color-gp-bg)`
- Cards de artículos: `border: 1px solid var(--color-gp-border)`, sin emojis
- Botón "Leer más": `.btn-secondary` o link con `color: gp-blue`

### `src/pages/articulos/[slug].astro`
- Wrapper: fondo `var(--color-gp-bg)`, card `bg-white border border-[#DDE6F2]`
- Prose colors: actualizar `--tw-prose-headings` a `#00246B`, `--tw-prose-links` a `#0074D9`

---

## 8. Footer (`src/components/layout/Footer.astro`)

### Cambios

- Fondo: mantener oscuro (`#081C3A` en lugar de `gray-900`) — más alineado con `gp-text`
- Logo: mantener en caja blanca (funciona sobre fondo oscuro)
- "GIST POINT S.A.S.": mantener
- "Tu aliado tecnológico": no, cambiar a "Tecnología para comprender y resolver problemas complejos."
- Títulos columnas: "Recursos", "Contacto" (eliminar mayúsculas innecesarias)
- Segunda columna: "Calculadora de importación", "Guías de importación", "Asesoramiento"
- Botón "Solicitar Asesoramiento": simplificar a link de texto, quitar emoji
- Mantener WhatsApp link y email
- Copyright: texto actual está bien

---

## 9. Tipografía — sentence case

Regla aplicada en **todos** los textos de UI (no artículos de blog):

| ❌ Actual | ✅ Propuesta |
|---|---|
| "¿Cómo Funciona La Calculadora?" | "¿Cómo funciona la calculadora?" |
| "Solicitar Asesoramiento" | "Solicitar asesoramiento" |
| "Calcular Costos de Importación" | "Calcular costos de importación" |
| "Guías Importación" | "Guías de importación" |
| "Probar Ahora" | "Probar ahora" |
| "Contactar un Experto" | "Contactar un experto" |

Se aplica a: nav items, títulos de secciones, textos de botones, h2/h3 en todas las páginas.

**Excepción:** "GIST POINT" y "GIST POINT S.A.S." se mantienen en mayúsculas (es el nombre de marca).

---

## 10. Íconos

**No usar librería externa.** SVG inline con los siguientes paths de Lucide:

- `activity` (señal): hero beneficio "cálculo preciso"
- `lock`: hero beneficio "datos seguros"
- `clock`: hero beneficio "resultados inmediatos"
- `percent`: sección costos "aranceles"
- `file-text`: sección costos "impuestos"
- `truck`: sección costos "logística"
- `building-2`: sección costos "gastos operativos"

Estilo: `width: 22px`, `height: 22px`, `stroke: currentColor`, `stroke-width: 1.8`, `fill: none`.

---

## 11. Mapa de archivos

| Archivo | Acción |
|---|---|
| `src/styles/global.css` | Actualizar paleta + componentes globales |
| `src/components/layout/Header.astro` | Reescritura completa |
| `src/components/layout/Footer.astro` | Actualización de colores y texto |
| `src/components/sections/Hero.astro` | Reescritura completa |
| `src/pages/index.astro` | Nueva estructura de secciones |
| `src/pages/calculadora/index.astro` | Actualizar wrapper |
| `src/components/calculator/ImportCalculator.tsx` | Restyling de clases CSS (sin tocar lógica) |
| `src/pages/contacto.astro` | Actualizar colores y botón |
| `src/pages/articulos/index.astro` | Actualizar colores |
| `src/pages/articulos/[slug].astro` | Actualizar wrapper |

**No se toca:** `worker.js`, `wrangler.jsonc`, `src/pages/admin/leads.astro`, `src/layouts/BaseLayout.astro`.
