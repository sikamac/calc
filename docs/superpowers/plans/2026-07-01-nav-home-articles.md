# Nav Dropdown + Home Selector + 4 Artículos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer discoverable la calculadora courier agregando nav dropdown, sección de selección en el home, y 4 artículos de soporte con investigación web real.

**Architecture:** El Header.astro recibe un navItems tipado que soporta grupos con children; el home agrega una sección estática entre Hero y gist-strip; los artículos son markdown con frontmatter estándar e imágenes placeholder que el usuario reemplaza con IA.

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript 5, Cloudflare Pages. Sin dependencias nuevas.

## Global Constraints

- Rama activa: `feat/courier-calculator` — todos los commits van ahí
- No iniciar dev server durante tests — solo `npm run build`
- No emojis en texto de UI
- Sin comentarios en código a menos que el WHY sea no obvio
- Imágenes de artículos: las genera el usuario con IA; el implementador copia una imagen existente como placeholder con el nombre correcto (`src/assets/images/guides/<slug>.png`) — el usuario la reemplaza después
- Artículos: el contenido debe ser investigado con búsqueda web real (WebSearch + WebFetch) — no generado solo desde memoria
- Tailwind CSS 4 — usar clases estándar, sin `@apply` en línea
- Cada artículo debe linkear al calculador correspondiente en su CTA final
- Build esperado al final: 22 páginas (18 actuales + 4 artículos nuevos)

---

### Task 1: Nav dropdown — `Header.astro`

**Files:**
- Modify: `src/components/layout/Header.astro`

**Interfaces:**
- Produces: nav con grupo "Calculadoras" → dropdown con `/calculadora` y `/calculadora/courier`
- Consumed by: todas las páginas (BaseLayout usa Header)

- [ ] **Step 1: Leer el archivo actual completo**

Leer `src/components/layout/Header.astro` para entender el navItems actual y el script de mobile menu.

- [ ] **Step 2: Reemplazar navItems con estructura que soporta children**

En el frontmatter del componente (bloque `---`), reemplazar la definición de `navItems` con:

```typescript
type NavChild = { href: string; label: string; description: string };
type NavItem =
  | { href: string; label: string; children?: never }
  | { label: string; href?: never; children: NavChild[] };

const navItems: NavItem[] = [
  {
    label: 'Calculadoras',
    children: [
      { href: '/calculadora', label: 'Importación formal', description: 'Aranceles, IVA, tasa estadística y despacho' },
      { href: '/calculadora/courier', label: 'Courier / Puerta a puerta', description: 'Compras online, franquicia USD 400' },
    ],
  },
  { href: '/blog', label: 'Guías de importación' },
  { href: '/herramientas-para-negocios', label: 'Herramientas para negocios' },
];
```

- [ ] **Step 3: Actualizar el desktop nav para renderizar dropdown**

En la sección `<!-- Desktop nav -->`, reemplazar el `navItems.map(...)` existente con:

```astro
{navItems.map((item) => {
  if (item.children) {
    const isActive = item.children.some(c => currentPath === c.href || currentPath.startsWith(c.href + '/'));
    return (
      <div class="group relative h-[76px] flex items-center">
        <button
          class:list={[
            'flex items-center gap-1 text-[14px] font-medium transition-colors border-b-2 h-full',
            isActive
              ? 'text-[#0074D9] border-[#0074D9]'
              : 'text-[#081C3A] border-transparent hover:text-[#0074D9]',
          ]}
          aria-haspopup="true"
        >
          {item.label}
          <svg class="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 mt-0 w-64 bg-white border border-[#DDE6F2] rounded-lg shadow-md z-50 py-1">
          {item.children.map((child) => {
            const isChildActive = currentPath === child.href;
            return (
              <a
                href={child.href}
                class:list={[
                  'block px-4 py-3 hover:bg-[#F3F7FC] transition-colors no-underline',
                  isChildActive ? 'text-[#0074D9]' : 'text-[#081C3A]',
                ]}
              >
                <span class="block text-[14px] font-medium">{child.label}</span>
                <span class="block text-[12px] text-[#5D6B82] mt-0.5">{child.description}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }
  const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
  return (
    <a
      href={item.href}
      class:list={[
        'h-[76px] flex items-center text-[14px] font-medium no-underline transition-colors border-b-2',
        isActive
          ? 'text-[#0074D9] border-[#0074D9]'
          : 'text-[#081C3A] border-transparent hover:text-[#0074D9]',
      ]}
      aria-current={isActive ? 'page' : false}
    >
      {item.label}
    </a>
  );
})}
```

- [ ] **Step 4: Actualizar el mobile menu para renderizar accordion**

En la sección `<!-- Mobile menu -->`, reemplazar el `navItems.map(...)` existente con:

```astro
{navItems.map((item) => {
  if (item.children) {
    return (
      <div>
        <button
          class="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-[#081C3A] hover:text-[#0074D9] hover:bg-[#F3F7FC] nav-accordion-btn"
          aria-expanded="false"
        >
          {item.label}
          <svg class="w-4 h-4 nav-accordion-chevron transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="hidden nav-accordion-panel pl-4 space-y-1">
          {item.children.map((child) => (
            <a
              href={child.href}
              class="block px-3 py-2 rounded-md text-sm font-medium text-[#5D6B82] hover:text-[#0074D9] hover:bg-[#F3F7FC] no-underline"
            >
              {child.label}
            </a>
          ))}
        </div>
      </div>
    );
  }
  const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
  return (
    <a
      href={item.href}
      class:list={[
        'block px-3 py-2 rounded-md text-base font-medium',
        isActive
          ? 'text-[#0074D9] bg-[#F3F7FC]'
          : 'text-[#081C3A] hover:text-[#0074D9] hover:bg-[#F3F7FC]',
      ]}
      aria-current={isActive ? 'page' : false}
    >
      {item.label}
    </a>
  );
})}
```

- [ ] **Step 5: Agregar JS para accordion mobile al `<script is:inline>` existente**

Al final del bloque `<script is:inline>` existente (dentro de las llaves del script, antes del cierre), agregar:

```javascript
// Mobile accordion for nav groups
document.querySelectorAll('.nav-accordion-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const chevron = btn.querySelector('.nav-accordion-chevron');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    panel?.classList.toggle('hidden', isOpen);
    chevron?.classList.toggle('rotate-180', !isOpen);
  });
});
```

- [ ] **Step 6: Build y verificar**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `18 page(s) built`, 0 errores TypeScript.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.astro
git commit -m "feat: add calculadoras dropdown to nav with courier and formal links"
```

---

### Task 2: Sección home "¿Para qué importás?" — `index.astro`

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: nada de otras tasks
- Produces: sección visual entre Hero y `.gist-strip` con cards a `/calculadora` y `/calculadora/courier`

- [ ] **Step 1: Leer index.astro para ubicar el punto de inserción**

Leer `src/pages/index.astro`. Encontrar la línea donde empieza `<section class="gist-strip">` — la nueva sección va inmediatamente antes de esa línea.

- [ ] **Step 2: Insertar la sección después del `<Hero />` y antes del gist-strip**

Insertar este bloque exacto entre `<Hero />` y `<section class="gist-strip">`:

```astro
<!-- Selector de calculadora -->
<section style="padding: 56px 0; background: #fff;">
  <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
    <p class="text-center text-sm font-semibold text-[#0074D9] uppercase tracking-wider mb-4">
      ¿Qué tipo de importación necesitás calcular?
    </p>
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Card courier -->
      <div class="bg-white border border-[#DDE6F2] rounded-xl p-8 hover:shadow-md hover:border-[#0074D9] transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-[#F3F7FC] rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#0074D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span class="px-2.5 py-1 bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold rounded-full">Más buscado</span>
        </div>
        <h2 class="text-xl font-bold text-[#081C3A] mb-2">Compras personales del exterior</h2>
        <p class="text-[#5D6B82] text-sm mb-6 leading-relaxed">
          Shein, Temu, AliExpress, compras online. Franquicia de USD 400, hasta 5 envíos por año.
        </p>
        <a href="/calculadora/courier" class="btn btn-primary w-full text-center">
          Calculadora courier →
        </a>
      </div>
      <!-- Card formal -->
      <div class="bg-white border border-[#DDE6F2] rounded-xl p-8 hover:shadow-md hover:border-[#0074D9] transition-all">
        <div class="mb-4">
          <div class="w-12 h-12 bg-[#F3F7FC] rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#0074D9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
        </div>
        <h2 class="text-xl font-bold text-[#081C3A] mb-2">Importación comercial o empresarial</h2>
        <p class="text-[#5D6B82] text-sm mb-6 leading-relaxed">
          Materias primas, productos para reventa, equipamiento. Aranceles según NCM, despacho aduanero.
        </p>
        <a href="/calculadora" class="btn btn-outline w-full text-center">
          Calculadora de importación →
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verificar que `btn-outline` existe en los estilos globales**

Buscar en el proyecto si la clase `.btn-outline` está definida:
```bash
grep -r "btn-outline" /home/km/Proyectos/calc/src/ | head -5
```

Si existe y se usa en otras páginas, no hay nada que hacer. Si no existe, agregar en el `<style>` de index.astro:
```css
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: 2px solid #0074D9;
  color: #0074D9;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}
.btn-outline:hover {
  background: #0074D9;
  color: #fff;
}
```

- [ ] **Step 4: Build y verificar**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `18 page(s) built`, 0 errores.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add calculator selector section to home page"
```

---

### Task 3: Artículo — Tasa estadística

**Files:**
- Create: `src/content/articulos/tasa-estadistica-importaciones-argentina.md`
- Copy placeholder image to: `src/assets/images/guides/tasa-estadistica-importaciones-argentina.png`

**Interfaces:**
- Consumes: nada de otras tasks
- Produces: artículo publicado en `/blog/tasa-estadistica-importaciones-argentina`

- [ ] **Step 1: Buscar información oficial actualizada**

Usar WebSearch y WebFetch para investigar:
- "tasa estadística importaciones Argentina 2026 ARCA"
- "Decreto 690/2002 tasa estadística"
- "tasa estadística importaciones tope máximo Argentina"

Tomar nota de: porcentaje vigente (0.5%), base de cálculo (valor CIF), topes por tramo, exenciones, fuente normativa exacta con número de decreto/resolución y fecha.

- [ ] **Step 2: Copiar imagen placeholder**

```bash
cp /home/km/Proyectos/calc/src/assets/images/guides/impuestos-importacion.png \
   /home/km/Proyectos/calc/src/assets/images/guides/tasa-estadistica-importaciones-argentina.png
```

- [ ] **Step 3: Crear el artículo**

Crear `src/content/articulos/tasa-estadistica-importaciones-argentina.md` con el contenido investigado. El frontmatter debe ser exactamente:

```markdown
---
title: "¿Qué es la tasa estadística en importaciones? Guía Argentina 2026"
date: 2026-07-01
category: "Impuestos"
image: "../../assets/images/guides/tasa-estadistica-importaciones-argentina.png"
description: "La tasa estadística es un tributo del 0,5% sobre el valor CIF que se paga en importaciones formales en Argentina. Entendé cuándo aplica, sus topes y cómo aparece en la calculadora."
author: "Equipo de GIST POINT"
tags: ["tasa estadística", "impuestos importación", "aduana Argentina", "ARCA"]
---
```

El cuerpo debe incluir estas secciones (con contenido real investigado, no placeholders):

1. **¿Qué es la tasa estadística?** — definición en palabras simples, para qué sirve
2. **¿Cuánto se paga?** — porcentaje, base de cálculo, topes vigentes con tabla
3. **¿Cuándo aplica y cuándo no?** — exenciones, regímenes exceptuados (courier, etc.)
4. **Cómo aparece en la calculadora** — párrafo explicando que el campo "Tasa estadística" en `/calculadora` la pre-calcula automáticamente
5. **Ejemplo numérico** — importación de USD 10.000 CIF: cálculo paso a paso mostrando el monto de la tasa y el tope
6. **Preguntas frecuentes** (2-3 Q&As en H3)
7. **CTA final**: `Calculá el costo total de tu importación, incluyendo la tasa estadística, en nuestra [calculadora de importaciones](/calculadora).`

- [ ] **Step 4: Build y verificar**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `19 page(s) built`, 0 errores.

- [ ] **Step 5: Commit**

```bash
git add src/content/articulos/tasa-estadistica-importaciones-argentina.md \
        src/assets/images/guides/tasa-estadistica-importaciones-argentina.png
git commit -m "feat: add tasa estadística importaciones article"
```

---

### Task 4: Artículo — IVA en importaciones

**Files:**
- Create: `src/content/articulos/iva-importaciones-argentina.md`
- Copy placeholder image to: `src/assets/images/guides/iva-importaciones-argentina.png`

**Interfaces:**
- Consumes: nada de otras tasks
- Produces: artículo en `/blog/iva-importaciones-argentina`

- [ ] **Step 1: Buscar información oficial actualizada**

Usar WebSearch y WebFetch para investigar:
- "IVA importaciones Argentina 2026 tasa adicional"
- "IVA adicional importaciones Argentina resolución general ARCA"
- "percepciones ingresos brutos importaciones Argentina"
- "base imponible IVA importaciones valor CIF arancel"

Tomar nota de: tasa IVA estándar (21%), tasa IVA adicional (10,5% o 20% según categoría), cómo se calcula la base imponible (CIF + arancel + tasa estadística), fuentes normativas.

- [ ] **Step 2: Copiar imagen placeholder**

```bash
cp /home/km/Proyectos/calc/src/assets/images/guides/impuestos-importacion.png \
   /home/km/Proyectos/calc/src/assets/images/guides/iva-importaciones-argentina.png
```

- [ ] **Step 3: Crear el artículo**

Crear `src/content/articulos/iva-importaciones-argentina.md`:

```markdown
---
title: "IVA en importaciones: por qué pagás más del 21% en Argentina"
date: 2026-07-01
category: "Impuestos"
image: "../../assets/images/guides/iva-importaciones-argentina.png"
description: "Al importar en Argentina pagás IVA del 21% más un IVA adicional del 10,5% o 20%. Entendé cómo se calcula la base imponible, qué es el IVA adicional y cuándo aplican las percepciones."
author: "Equipo de GIST POINT"
tags: ["IVA importaciones", "IVA adicional", "percepciones", "aduana Argentina"]
---
```

El cuerpo debe incluir (con contenido real investigado):

1. **¿Por qué el IVA en importaciones es diferente al IVA normal?** — la base imponible incluye más que el precio del producto
2. **La base imponible paso a paso** — tabla mostrando: Valor CIF → + Arancel → + Tasa estadística = Base IVA → × 21% = IVA
3. **¿Qué es el IVA adicional?** — quiénes lo pagan, tasas (10,5% / 20%), diferencia entre responsables inscriptos y no inscriptos
4. **Percepciones de ingresos brutos** — qué son, cuándo aplican (referencia, no profundizar)
5. **Ejemplo numérico completo** — importación de USD 5.000 CIF con arancel 14%, mostrando IVA + IVA adicional paso a paso
6. **Cómo aparece en la calculadora** — campos IVA e IVA adicional en `/calculadora`
7. **Preguntas frecuentes** (2-3 Q&As)
8. **CTA final**: link a `/calculadora`

- [ ] **Step 4: Build y verificar**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `20 page(s) built`, 0 errores.

- [ ] **Step 5: Commit**

```bash
git add src/content/articulos/iva-importaciones-argentina.md \
        src/assets/images/guides/iva-importaciones-argentina.png
git commit -m "feat: add IVA en importaciones article"
```

---

### Task 5: Artículo — Derecho antidumping

**Files:**
- Create: `src/content/articulos/derecho-antidumping-importaciones.md`
- Copy placeholder image to: `src/assets/images/guides/derecho-antidumping-importaciones.png`

**Interfaces:**
- Consumes: nada de otras tasks
- Produces: artículo en `/blog/derecho-antidumping-importaciones`

- [ ] **Step 1: Buscar información oficial actualizada**

Usar WebSearch y WebFetch para investigar:
- "derecho antidumping Argentina 2026 qué es"
- "Ley 24425 antidumping Argentina"
- "cómo consultar derechos antidumping Argentina ARCA"
- "productos con antidumping Argentina 2026"

Tomar nota de: definición legal, cómo se determina (investigación de dumping), cómo consultarlo para un NCM específico, ejemplos de productos con antidumping vigente en Argentina, fuente normativa.

- [ ] **Step 2: Copiar imagen placeholder**

```bash
cp /home/km/Proyectos/calc/src/assets/images/guides/derechos-aduaneros-aranceles-importacion-argentina.png \
   /home/km/Proyectos/calc/src/assets/images/guides/derecho-antidumping-importaciones.png
```

- [ ] **Step 3: Crear el artículo**

Crear `src/content/articulos/derecho-antidumping-importaciones.md`:

```markdown
---
title: "¿Qué es el derecho antidumping en importaciones?"
date: 2026-07-01
category: "Impuestos"
image: "../../assets/images/guides/derecho-antidumping-importaciones.png"
description: "El derecho antidumping es un recargo aduanero que Argentina aplica a productos importados a precios artificialmente bajos. Entendé cuándo aplica, cómo consultarlo y cómo afecta el costo de tu importación."
author: "Equipo de GIST POINT"
tags: ["antidumping", "derechos aduaneros", "importación Argentina", "ARCA"]
---
```

El cuerpo debe incluir (con contenido real investigado):

1. **¿Qué es el dumping?** — explicación simple: vender por debajo del costo para ganar mercado
2. **¿Qué es el derecho antidumping?** — recargo compensatorio, quién lo decide, marco legal (Ley 24.425)
3. **¿Cuándo aplica?** — proceso de investigación, resolución, vigencia
4. **¿Cómo consultarlo para tu producto?** — guía paso a paso para consultar en el sistema ARCA/Ventanilla Única (con URL si está disponible)
5. **Ejemplos de productos con antidumping en Argentina** — tabla con 3-5 ejemplos reales investigados
6. **Cómo aparece en la calculadora** — el campo "Derecho antidumping %" en `/calculadora`, cómo saber qué valor ingresar
7. **Preguntas frecuentes** (2-3 Q&As)
8. **CTA final**: link a `/calculadora`

- [ ] **Step 4: Build y verificar**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `21 page(s) built`, 0 errores.

- [ ] **Step 5: Commit**

```bash
git add src/content/articulos/derecho-antidumping-importaciones.md \
        src/assets/images/guides/derecho-antidumping-importaciones.png
git commit -m "feat: add derecho antidumping article"
```

---

### Task 6: Artículo — Courier privado vs Correo Argentino

**Files:**
- Create: `src/content/articulos/courier-privado-vs-correo-argentino.md`
- Copy placeholder image to: `src/assets/images/guides/courier-privado-vs-correo-argentino.png`

**Interfaces:**
- Consumes: lógica de los dos canales de `src/lib/courier-calculation.ts` (para exactitud numérica)
- Produces: artículo en `/blog/courier-privado-vs-correo-argentino`

- [ ] **Step 1: Buscar información oficial actualizada**

Usar WebSearch y WebFetch para investigar:
- "Decreto 1065/2024 courier privado Argentina"
- "Correo Argentino envíos internacionales franquicia 2026"
- "DHL FedEx UPS Argentina importación personal"
- "portal ARCA envíos internacionales Correo Argentino"

Tomar nota de: diferencias de franquicia (USD 400 privado vs USD 50 Correo Argentino), diferencias de IVA, proceso de declaración en cada canal, tiempos estimados, costos operativos de cada opción.

- [ ] **Step 2: Copiar imagen placeholder**

```bash
cp /home/km/Proyectos/calc/src/assets/images/guides/comprar-shein-temu-argentina-regimen-courier.png \
   /home/km/Proyectos/calc/src/assets/images/guides/courier-privado-vs-correo-argentino.png
```

- [ ] **Step 3: Crear el artículo**

Crear `src/content/articulos/courier-privado-vs-correo-argentino.md`:

```markdown
---
title: "Courier privado vs Correo Argentino: diferencias, costos y cuándo usar cada uno"
date: 2026-07-01
category: "Courier"
image: "../../assets/images/guides/courier-privado-vs-correo-argentino.png"
description: "DHL, FedEx y UPS tienen franquicia de USD 400 con IVA 21%. Correo Argentino tiene franquicia de USD 50 sin IVA. Comparación completa de ambos canales para compras del exterior en Argentina 2026."
author: "Equipo de GIST POINT"
tags: ["courier privado", "Correo Argentino", "DHL FedEx UPS", "compras del exterior", "franquicia"]
---
```

El cuerpo debe incluir (con contenido real investigado):

1. **Dos canales, dos regímenes** — introducción: no todos los paquetes del exterior llegan igual
2. **Courier privado (DHL, FedEx, UPS)** — cómo funciona, franquicia USD 400, IVA 21% siempre, arancel 50% s/excedente, Decreto 1065/2024
3. **Correo Argentino** — franquicia USD 50, sin IVA dentro de franquicia, 50% all-inclusive sobre excedente, proceso de declaración en portal ARCA
4. **Tabla comparativa completa**:

| | Courier privado | Correo Argentino |
|---|---|---|
| Franquicia | USD 400 | USD 50 |
| IVA | 21% sobre total | Sin IVA (dentro de franquicia) |
| Arancel excedente | 50% s/(base-400) | 50% all-inclusive s/(base-50) |
| Límite por envío | USD 3.000 | USD 3.000 |
| Peso máximo | 50 kg | 20 kg |
| Gestión aduanera | El courier gestiona | El usuario declara en ARCA |
| Tiempo estimado | Más rápido | Variable |

5. **Ejemplo numérico: USD 300 en cada canal** — mostrar diferencia de costo total
6. **¿Cuándo conviene cada uno?** — guía práctica: montos bajos → Correo Argentino; montos cercanos a USD 400 o urgencia → privado
7. **Preguntas frecuentes** (2-3 Q&As)
8. **CTA final**: `Calculá el costo exacto en nuestra [calculadora courier](/calculadora/courier), que incluye ambos canales.`

- [ ] **Step 4: Build final y verificar página count**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -5
```

Esperado: `22 page(s) built`, 0 errores TypeScript.

- [ ] **Step 5: Commit**

```bash
git add src/content/articulos/courier-privado-vs-correo-argentino.md \
        src/assets/images/guides/courier-privado-vs-correo-argentino.png
git commit -m "feat: add courier privado vs Correo Argentino article"
```
