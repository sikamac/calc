# Overhaul Estético — Propuesta 4 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el sistema de diseño GP (navy/blue, sin naranja, sin emojis, sentence case) a todas las páginas del sitio para que se vea como una herramienta financiera profesional.

**Architecture:** Cascada de dependencias: global.css primero (define variables y clases base), luego componentes de layout (Header, Footer), luego componentes de sección (Hero), finalmente páginas (index, calculadora, contacto, articulos). Cada task puede buildearse y verificarse de forma independiente.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), React (solo `ImportCalculator.tsx`), Cloudflare Workers/static

---

## Mapa de archivos

| Archivo | Acción |
|---|---|
| `src/styles/global.css` | Agregar paleta GP, actualizar componentes `.btn-*`, prose |
| `src/components/layout/Header.astro` | Reescritura: sin logo box, nav underline, botón CTA |
| `src/components/layout/Footer.astro` | Actualizar colores, texto, simplificar botón |
| `src/components/sections/Hero.astro` | Reescritura: fondo blanco, 2 col, benefits + example card |
| `src/pages/index.astro` | Reemplazar secciones: nueva estructura de 5 secciones |
| `src/components/calculator/ImportCalculator.tsx` | Restyling de clases CSS, sin tocar lógica |
| `src/pages/calculadora/index.astro` | Actualizar wrapper y texto |
| `src/pages/contacto.astro` | Actualizar colores, remover emojis |
| `src/pages/articulos/index.astro` | Actualizar colores, botones, CTA |
| `src/pages/articulos/[slug].astro` | Actualizar colores, sidebar, CTAs |

---

## Task 1: Design system — `global.css`

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Reemplazar el contenido completo de `src/styles/global.css`**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Legacy aliases — mantenidos para compatibilidad con prose de artículos */
  --color-primary: #003366;
  --color-secondary: #0066CC;

  /* GP design system */
  --color-gp-navy:         #00246B;
  --color-gp-blue:         #0074D9;
  --color-gp-blue-dark:    #001B4D;
  --color-gp-aqua:         #8FE3D5;
  --color-gp-bg:           #F8FAFC;
  --color-gp-surface:      #FFFFFF;
  --color-gp-surface-soft: #F3F7FC;
  --color-gp-text:         #081C3A;
  --color-gp-text-muted:   #5D6B82;
  --color-gp-border:       #DDE6F2;

  --font-sans: Inter, system-ui, sans-serif;
}

@layer base {
  html {
    font-family: Inter, system-ui, sans-serif;
    scroll-behavior: smooth;
  }
  h1, h2, h3, h4, button, nav a {
    text-transform: none;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200;
    text-transform: none;
  }
  .btn-primary {
    background: #001B4D;
    color: #fff;
    box-shadow: 0 10px 24px rgba(0, 36, 107, 0.18);
  }
  .btn-primary:hover { background: #00246B; }
  .btn-secondary {
    background: #fff;
    color: #00246B;
    border: 1px solid #DDE6F2;
  }
  .btn-secondary:hover { background: #F3F7FC; }
  .btn-outline {
    @apply border-2 border-[#00246B] text-[#00246B] hover:bg-[#00246B] hover:text-white;
  }
}

/* Prose — artículos del blog */
.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #00246B;
  --tw-prose-links: #0074D9;
  --tw-prose-bold: #00246B;
  --tw-prose-code: #00246B;
  --tw-prose-quotes: #374151;
  --tw-prose-quote-borders: #0074D9;
  --tw-prose-bullets: #0074D9;
  --tw-prose-counters: #0074D9;
  --tw-prose-th-borders: #e5e7eb;
  --tw-prose-td-borders: #e5e7eb;
  --tw-prose-hr: #e5e7eb;
  max-width: none;
}

.prose code::before,
.prose code::after {
  content: '';
}

.prose :not(pre) > code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 400;
  color: #00246B;
}

.prose thead {
  background-color: #f3f4f6;
  color: #00246B;
}

.prose blockquote {
  background-color: #F3F7FC;
  padding: 1rem 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
}

.prose a:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

Esperado: sin errores, 8 páginas generadas.

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/styles/global.css
git commit -m "feat: update design system — GP color palette, new btn-primary navy, sentence case"
```

---

## Task 2: Header

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/components/layout/Header.astro`**

```astro
---
const navItems = [
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/articulos', label: 'Guías de importación' },
  { href: '/contacto', label: 'Asesoramiento' },
];

const currentPath = Astro.url.pathname;
---

<header class="sticky top-0 z-50 h-[76px] flex items-center bg-white/90 backdrop-blur-sm border-b border-[#DDE6F2]">
  <nav class="w-full px-6 max-w-[1228px] mx-auto" aria-label="Navegación principal">
    <div class="flex items-center justify-between">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 no-underline">
        <img src="/logo.svg" alt="GIST POINT" class="w-10 h-10" />
        <span class="text-[17px] font-bold text-[#00246B]">GIST POINT</span>
      </a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || (currentPath.startsWith(item.href + '/'));
          return (
            <a
              href={item.href}
              class:list={[
                'text-[14px] font-medium no-underline transition-colors border-b-2 pb-[26px]',
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

        <!-- WhatsApp -->
        <a
          href="https://wa.me/5493513464248"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          class="p-2 text-[#5D6B82] hover:text-green-600 transition-colors flex items-center"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>

        <!-- CTA -->
        <a href="/contacto" class="btn btn-primary text-[14px] py-2.5 px-[18px]">
          Solicitar asesoramiento
        </a>
      </div>

      <!-- Mobile hamburger -->
      <div class="md:hidden">
        <button
          type="button"
          id="mobile-menu-button"
          class="inline-flex items-center justify-center p-2 rounded-md text-[#5D6B82] hover:text-[#00246B] hover:bg-[#F3F7FC] focus:outline-none focus:ring-2 focus:ring-[#00246B]"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span class="sr-only">Abrir menú principal</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#DDE6F2]">
        {navItems.map((item) => {
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
        <a
          href="https://wa.me/5493513464248"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-[#F3F7FC]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  </nav>
</header>

<script>
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (button && menu) {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      menu.classList.toggle('hidden');
    });
  }
</script>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/layout/Header.astro
git commit -m "feat: redesign header — nav underline, logo without box, CTA button"
```

---

## Task 3: Footer

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/components/layout/Footer.astro`**

```astro
---
const currentYear = new Date().getFullYear();
---

<footer style="background: #081C3A; color: #fff;" class="py-12" id="contacto">
  <div class="max-w-[1228px] mx-auto px-6">
    <div class="grid md:grid-cols-3 gap-8">

      <!-- Brand -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="bg-white p-2 rounded-lg">
            <img src="/logo.svg" alt="Logo GIST POINT" class="h-10 w-auto" />
          </div>
          <span class="text-[17px] font-bold">GIST POINT</span>
        </div>
        <p class="text-[#5D6B82] text-sm leading-relaxed">
          <span class="font-semibold text-white">GIST POINT S.A.S.</span><br/>
          Tecnología para comprender y resolver problemas complejos.
        </p>
        <p class="text-[#5D6B82] text-sm">
          Calculadora gratuita para determinar costos de importación en Argentina.
        </p>
      </div>

      <!-- Links -->
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wider text-[#5D6B82] mb-4">Recursos</h3>
        <ul class="space-y-2">
          <li><a href="/calculadora" class="text-[#5D6B82] hover:text-white transition-colors text-sm">Calculadora de importación</a></li>
          <li><a href="/articulos" class="text-[#5D6B82] hover:text-white transition-colors text-sm">Guías de importación</a></li>
          <li><a href="/contacto" class="text-[#5D6B82] hover:text-white transition-colors text-sm">Asesoramiento</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wider text-[#5D6B82] mb-4">Contacto</h3>
        <p class="text-[#5D6B82] text-sm mb-4">
          Contactate con nuestro equipo de expertos en importaciones.
        </p>
        <div class="space-y-3">
          <a
            href="/contacto"
            class="block text-sm font-semibold text-white hover:text-[#8FE3D5] transition-colors"
          >
            Solicitar asesoramiento →
          </a>
          <a
            href="mailto:info@gist-point.com"
            class="block text-sm text-[#5D6B82] hover:text-white transition-colors"
          >
            info@gist-point.com
          </a>
          <a
            href="https://wa.me/5493513464248"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>

    <div class="mt-10 pt-8 border-t border-white/10 text-center text-sm text-[#5D6B82]">
      <p>&copy; {currentYear} GIST POINT S.A.S. — Calculadora de importaciones Argentina. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/layout/Footer.astro
git commit -m "feat: redesign footer — GP colors, simplified CTA, updated tagline"
```

---

## Task 4: Hero

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/components/sections/Hero.astro`**

```astro
---
---

<section style="background: #F8FAFC; padding: 88px 0 48px;">
  <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
    <div class="hero-grid">

      <!-- Columna izquierda -->
      <div>
        <p class="eyebrow">Herramienta gratuita · Argentina</p>
        <h1>Calculá el costo total de tu importación, con precisión</h1>
        <p class="hero-desc">
          Estimá todos los costos asociados a tu importación en segundos y tomá mejores decisiones para tu negocio.
        </p>

        <div class="benefit-list">
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <h3>Cálculo preciso</h3>
              <p>Todos los costos en un solo lugar</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h3>Datos seguros</h3>
              <p>Tu información está protegida</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3>Resultados inmediatos</h3>
              <p>Obtené tu estimación al instante</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna derecha — ejemplo estático -->
      <div>
        <div class="calc-card">
          <p class="card-label">Ejemplo de estimación</p>
          <div class="example-rows">
            <div class="example-row">
              <span>Valor FOB</span><span class="example-val">USD 10.000</span>
            </div>
            <div class="example-row">
              <span>Flete y seguro</span><span class="example-val">USD 1.200</span>
            </div>
            <div class="example-row">
              <span>Aranceles</span><span class="example-val">USD 1.320</span>
            </div>
            <div class="example-row">
              <span>Impuestos</span><span class="example-val">USD 2.530</span>
            </div>
            <div class="example-row">
              <span>Gastos operativos</span><span class="example-val">USD 680</span>
            </div>
            <div class="example-row example-total">
              <span>Total estimado</span><span>ARS 16.940.000</span>
            </div>
          </div>
          <p class="card-disclaimer">Ejemplo con valores ilustrativos · tasa USD 1.100</p>
          <a href="/calculadora" class="btn btn-primary" style="width:100%; margin-top:16px; justify-content:center;">
            Ir a la calculadora →
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  .hero-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 64px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  }

  .eyebrow {
    color: #0074D9;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  h1 {
    color: #081C3A;
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 24px;
    font-weight: 700;
  }
  .hero-desc {
    color: #5D6B82;
    font-size: 18px;
    line-height: 1.7;
    margin: 0;
  }
  .benefit-list {
    margin-top: 36px;
    display: grid;
    gap: 22px;
  }
  .benefit-item {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 16px;
    align-items: start;
  }
  .benefit-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #F3F7FC;
    color: #00246B;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .benefit-item h3 {
    font-size: 15px;
    margin: 0 0 4px;
    color: #081C3A;
    font-weight: 600;
  }
  .benefit-item p {
    font-size: 14px;
    margin: 0;
    color: #5D6B82;
  }

  .calc-card {
    background: #fff;
    border: 1px solid #DDE6F2;
    border-radius: 22px;
    padding: 32px;
    box-shadow: 0 18px 45px rgba(8, 28, 58, 0.08);
  }
  .card-label {
    font-size: 11px;
    font-weight: 600;
    color: #5D6B82;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 20px;
  }
  .example-rows {
    display: flex;
    flex-direction: column;
  }
  .example-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 14px;
    color: #5D6B82;
  }
  .example-val {
    font-weight: 500;
    color: #081C3A;
  }
  .example-total {
    border-bottom: none;
    border-top: 2px solid #DDE6F2;
    margin-top: 4px;
    padding-top: 14px;
    font-size: 16px;
    font-weight: 700;
    color: #0074D9;
  }
  .example-total span:last-child { color: #0074D9; }
  .card-disclaimer {
    font-size: 12px;
    color: #5D6B82;
    text-align: center;
    margin-top: 12px;
  }
</style>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/sections/Hero.astro
git commit -m "feat: redesign hero — white bg, 2-col grid, static example card, SVG icons"
```

---

## Task 5: Landing page — nuevas secciones

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Hero from '../components/sections/Hero.astro';
import Footer from '../components/layout/Footer.astro';

const title = "Calculadora de importaciones Argentina";
const description = "Calculá al instante los costos de importación en Argentina. Derechos, aranceles, IVA y más. Herramienta gratuita para importadores y despachantes.";
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
>
  <Header />
  <main>
    <Hero />

    <!-- Sección 2: Costos que incluye -->
    <section style="padding: 64px 0; background: #F8FAFC;">
      <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-[#081C3A] mb-3">Costos que incluye esta estimación</h2>
          <p class="text-[#5D6B82] text-lg max-w-2xl mx-auto">
            Nuestra calculadora tiene en cuenta todos los componentes del costo de importación.
          </p>
        </div>
        <div class="costs-grid">
          <div class="cost-item">
            <div class="cost-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"/>
                <circle cx="6.5" cy="6.5" r="2.5"/>
                <circle cx="17.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <h3>Aranceles de importación</h3>
              <p>Según clasificación arancelaria NCM y país de origen</p>
            </div>
          </div>
          <div class="cost-item">
            <div class="cost-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <div>
              <h3>Impuestos</h3>
              <p>IVA, percepción de ganancias y otros tributos nacionales</p>
            </div>
          </div>
          <div class="cost-item">
            <div class="cost-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M15 18H9"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                <circle cx="17" cy="18" r="2"/>
                <circle cx="7" cy="18" r="2"/>
              </svg>
            </div>
            <div>
              <h3>Costos logísticos</h3>
              <p>Flete internacional y seguro de la mercadería</p>
            </div>
          </div>
          <div class="cost-item">
            <div class="cost-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
                <path d="M9 22v-4h6v4"/>
                <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
                <path d="M12 10h.01"/><path d="M12 14h.01"/>
                <path d="M16 10h.01"/><path d="M16 14h.01"/>
                <path d="M8 10h.01"/><path d="M8 14h.01"/>
              </svg>
            </div>
            <div>
              <h3>Gastos operativos</h3>
              <p>Despacho, honorarios del despachante y costos portuarios</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección 3: Tomá decisiones con números reales -->
    <section style="padding: 72px 0; background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);">
      <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
        <div class="decisions-grid">
          <div>
            <h2 class="text-3xl font-bold text-[#081C3A] mb-6" style="letter-spacing:-0.02em;">
              Tomá decisiones con números reales
            </h2>
            <p class="text-[#5D6B82] text-lg leading-relaxed mb-8">
              Nuestra calculadora te brinda una estimación completa y detallada para que planifiques tu importación con confianza.
            </p>
            <div class="space-y-4">
              {[
                'Estimaciones basadas en datos actualizados',
                'Cálculo de todos los costos relevantes',
                'Herramienta rápida, clara y confiable',
              ].map((item) => (
                <div class="flex items-start gap-3">
                  <span class="text-[#0074D9] font-bold text-lg leading-none mt-0.5">✓</span>
                  <span class="text-[#5D6B82]">{item}</span>
                </div>
              ))}
            </div>
            <a href="/calculadora" class="btn btn-primary mt-8">
              Ir a la calculadora →
            </a>
          </div>
          <div>
            <div class="example-card-big">
              <p class="ecb-label">Ejemplo de estimación</p>
              <div class="ecb-rows">
                <div class="ecb-row"><span>Valor FOB</span><span class="ecb-val">USD 10.000</span></div>
                <div class="ecb-row"><span>Flete y seguro</span><span class="ecb-val">USD 1.200</span></div>
                <div class="ecb-row"><span>Aranceles (14%)</span><span class="ecb-val">USD 1.320</span></div>
                <div class="ecb-row"><span>Impuestos (IVA + percepciones)</span><span class="ecb-val">USD 2.530</span></div>
                <div class="ecb-row"><span>Gastos operativos</span><span class="ecb-val">USD 680</span></div>
                <div class="ecb-row ecb-total"><span>Total estimado</span><span>ARS 16.940.000</span></div>
              </div>
              <p class="ecb-disclaimer">Valores ilustrativos · tasa de cambio USD 1.100</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección 4: Información clave (4 cards, sin emojis) -->
    <section style="padding: 64px 0; background: #fff;">
      <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-[#081C3A] mb-3">Información clave sobre importaciones</h2>
          <p class="text-[#5D6B82] text-lg max-w-2xl mx-auto">
            Conocé los aspectos más importantes del comercio exterior y el despacho aduanero en Argentina.
          </p>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <h3>Despacho aduanero</h3>
            <p>Proceso obligatorio para todas las mercaderías que ingresan al país. Requiere un despachante de aduanas matriculado.</p>
            <ul>
              <li>Declaración jurada de importación</li>
              <li>Clasificación arancelaria NCM</li>
              <li>Documentación requerida</li>
              <li>Plazos y vencimientos</li>
            </ul>
          </div>
          <div class="info-card">
            <h3>Impuestos a la importación</h3>
            <p>Todos los tributos que se aplican a las operaciones de comercio exterior en Argentina.</p>
            <ul>
              <li>Derechos de importación</li>
              <li>IVA e impuestos internos</li>
              <li>Tasa estadística</li>
              <li>Percepciones y retenciones</li>
            </ul>
          </div>
          <div class="info-card">
            <h3>Logística y transporte</h3>
            <p>Opciones de transporte internacional y cálculo de costos logísticos para tu importación.</p>
            <ul>
              <li>Transporte marítimo y aéreo</li>
              <li>Seguro de carga</li>
              <li>Incoterms 2020</li>
              <li>Valor FOB y CIF</li>
            </ul>
          </div>
          <div class="info-card">
            <h3>Normativa y compliance</h3>
            <p>Cumplimiento regulatorio y obligaciones ante los organismos de control en Argentina.</p>
            <ul>
              <li>ARCA y Aduana</li>
              <li>Normas técnicas IRAM</li>
              <li>SENASA y ANMAT</li>
              <li>Restricciones y prohibiciones</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección 5: CTA final -->
    <section style="padding: 64px 0; background: #F8FAFC;">
      <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
        <div class="cta-card">
          <div class="cta-text">
            <h2>¿Necesitás acompañamiento para tu importación?</h2>
            <p>Nuestro equipo puede ayudarte a analizar tu caso particular y optimizar cada etapa del proceso.</p>
          </div>
          <a href="/contacto" class="btn btn-secondary cta-btn">
            Solicitar asesoramiento →
          </a>
        </div>
      </div>
    </section>

  </main>
  <Footer />
</BaseLayout>

<style>
  /* Sección 2 — Costos */
  .costs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
  @media (max-width: 900px) { .costs-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .costs-grid { grid-template-columns: 1fr; } }
  .cost-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 16px;
    align-items: start;
  }
  .cost-icon {
    width: 48px; height: 48px;
    background: #F3F7FC;
    border-radius: 14px;
    color: #00246B;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .cost-item h3 { font-size: 15px; font-weight: 600; color: #081C3A; margin: 0 0 6px; }
  .cost-item p  { font-size: 14px; color: #5D6B82; margin: 0; line-height: 1.5; }

  /* Sección 3 — Decisions */
  .decisions-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 64px;
    align-items: center;
  }
  @media (max-width: 900px) { .decisions-grid { grid-template-columns: 1fr; gap: 40px; } }

  .example-card-big {
    background: #fff;
    border: 1px solid #DDE6F2;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 12px 32px rgba(8,28,58,0.06);
  }
  .ecb-label { font-size: 11px; font-weight: 600; color: #5D6B82; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 20px; }
  .ecb-rows { display: flex; flex-direction: column; }
  .ecb-row {
    display: flex; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #F1F5F9;
    font-size: 14px; color: #5D6B82;
  }
  .ecb-val { font-weight: 500; color: #081C3A; }
  .ecb-total {
    border-bottom: none; border-top: 2px solid #DDE6F2;
    margin-top: 4px; padding-top: 14px;
    font-size: 16px; font-weight: 700; color: #0074D9;
  }
  .ecb-total span:last-child { color: #0074D9; }
  .ecb-disclaimer { font-size: 12px; color: #5D6B82; text-align: center; margin-top: 12px; }

  /* Sección 4 — Info cards */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  @media (max-width: 1024px) { .info-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px)  { .info-grid { grid-template-columns: 1fr; } }
  .info-card {
    border: 1px solid #DDE6F2;
    border-radius: 12px;
    padding: 24px;
    background: #fff;
  }
  .info-card h3 { font-size: 15px; font-weight: 700; color: #00246B; margin: 0 0 10px; }
  .info-card > p { font-size: 13px; color: #5D6B82; margin: 0 0 12px; line-height: 1.5; }
  .info-card ul { list-style: none; padding: 0; margin: 0; }
  .info-card ul li {
    font-size: 13px; color: #5D6B82;
    padding: 3px 0 3px 12px;
    position: relative;
  }
  .info-card ul li::before {
    content: '·';
    position: absolute; left: 0;
    color: #0074D9;
  }

  /* Sección 5 — CTA */
  .cta-card {
    background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);
    border-radius: 18px;
    padding: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  @media (max-width: 768px) { .cta-card { flex-direction: column; align-items: flex-start; } }
  .cta-text h2 { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 12px; line-height: 1.2; }
  .cta-text p  { color: rgba(255,255,255,0.75); margin: 0; font-size: 16px; max-width: 480px; }
  .cta-btn { white-space: nowrap; flex-shrink: 0; }
</style>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/pages/index.astro
git commit -m "feat: redesign landing — new section structure, GP colors, no emojis"
```

---

## Task 6: ImportCalculator — restyling

**Files:**
- Modify: `src/components/calculator/ImportCalculator.tsx`

Cambiar **únicamente** clases CSS y strings de texto. No tocar ninguna lógica de cálculo.

- [ ] **Step 1: Reemplazar wrapper y tabs (líneas 292–319)**

Reemplazar:
```tsx
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('importacion')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'importacion'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Costos de importación
            </button>
            <button
              onClick={() => setActiveTab('venta')}
              disabled={!calculo}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'venta'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!calculo ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              💰 Precio de venta
            </button>
          </nav>
        </div>
```

Con:
```tsx
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-[#DDE6F2] overflow-hidden" style={{boxShadow: '0 18px 45px rgba(8,28,58,0.08)'}}>
        {/* Tabs */}
        <div className="border-b border-[#DDE6F2]">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('importacion')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'importacion'
                  ? 'border-[#0074D9] text-[#0074D9]'
                  : 'border-transparent text-[#5D6B82] hover:text-[#081C3A] hover:border-[#DDE6F2]'
              }`}
            >
              Costos de importación
            </button>
            <button
              onClick={() => setActiveTab('venta')}
              disabled={!calculo}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'venta'
                  ? 'border-[#0074D9] text-[#0074D9]'
                  : 'border-transparent text-[#5D6B82] hover:text-[#081C3A] hover:border-[#DDE6F2]'
              } ${!calculo ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Precio de venta
            </button>
          </nav>
        </div>
```

- [ ] **Step 2: Actualizar subtítulos de sección (líneas 327, 625)**

Reemplazar `📊 Datos de importación` con `Datos de importación`

Reemplazar `💼 Datos de venta` con `Datos de venta`

- [ ] **Step 3: Actualizar subtítulos de impuestos (líneas 341, 376)**

Reemplazar `<h4 className="font-semibold text-primary">Impuestos aduaneros</h4>` con `<h4 className="font-semibold text-[#00246B]">Impuestos aduaneros</h4>`

Reemplazar `<h4 className="font-semibold text-primary">Impuestos al valor</h4>` con `<h4 className="font-semibold text-[#00246B]">Impuestos al valor</h4>`

Reemplazar `<h4 className="font-semibold text-primary">Gastos adicionales</h4>` con `<h4 className="font-semibold text-[#00246B]">Gastos adicionales</h4>`

Reemplazar `<h4 className="font-semibold text-primary">Tasas de IIBB</h4>` con `<h4 className="font-semibold text-[#00246B]">Tasas de IIBB</h4>`

- [ ] **Step 4: Actualizar inputs (reemplazar todas las ocurrencias)**

Usar replace_all para: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent`
→ `border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent`

- [ ] **Step 5: Actualizar card de resultado de importación (línea 502)**

Reemplazar `<div className="bg-green-50 border border-green-200 rounded-xl p-6">` con `<div className="bg-[#F3F7FC] border border-[#DDE6F2] rounded-xl p-6">`

Reemplazar `<h4 className="text-lg font-bold text-green-900 mb-4">✅ Resumen de costos</h4>` con `<h4 className="text-lg font-bold text-[#081C3A] mb-4">Resumen de costos</h4>`

Reemplazar todas las `border-green-200` con `border-[#DDE6F2]`

Reemplazar `border-b-2 border-green-300` con `border-b-2 border-[#DDE6F2]`

Reemplazar `border-b-2 border-green-400` con `border-b-2 border-[#DDE6F2]`

Reemplazar `text-orange-600` con `text-[#0074D9]`

Reemplazar `text-red-600` con `text-[#0074D9]`

Reemplazar:
```tsx
<div className="flex justify-between py-3 bg-green-100 rounded-lg px-4 mt-4">
  <span className="font-bold text-lg text-green-900">💰 COSTO FINAL</span>
  <span className="font-bold text-lg text-green-900">{formatCurrency(calculo.costoFinal)}</span>
</div>
```
Con:
```tsx
<div className="flex justify-between py-3 bg-[#F3F7FC] rounded-lg px-4 mt-4">
  <span className="font-bold text-lg text-[#081C3A]">Costo final</span>
  <span className="font-bold text-lg text-[#0074D9]">{formatCurrency(calculo.costoFinal)}</span>
</div>
```

Reemplazar:
```tsx
<div className="mt-4 p-3 bg-green-100 rounded-lg">
  <div className="flex justify-between">
    <span className="font-semibold">Costo total en FOB:</span>
    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
      {calculo.costoTotalEnFOB.toFixed(2)}x
    </span>
  </div>
</div>
```
Con:
```tsx
<div className="mt-4 p-3 bg-[#F3F7FC] rounded-lg">
  <div className="flex justify-between">
    <span className="font-semibold text-[#081C3A]">Costo total en FOB:</span>
    <span className="bg-[#00246B] text-white px-3 py-1 rounded-full text-sm font-bold">
      {calculo.costoTotalEnFOB.toFixed(2)}x
    </span>
  </div>
</div>
```

- [ ] **Step 6: Actualizar card de distribución (línea 578)**

Reemplazar `<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">` con `<div className="bg-[#F3F7FC] border border-[#DDE6F2] rounded-xl p-6">`

Reemplazar `<h4 className="text-lg font-bold text-blue-900 mb-4">📊 Distribución de costos</h4>` con `<h4 className="text-lg font-bold text-[#081C3A] mb-4">Distribución de costos</h4>`

Reemplazar `'bg-blue-600'` con `'bg-[#0074D9]'`

Reemplazar `'bg-orange-500'` con `'bg-[#00246B]'`

Reemplazar `'bg-red-500'` con `'bg-[#001B4D]'`

Reemplazar `'bg-purple-500'` con `'bg-[#8FE3D5]'`

- [ ] **Step 7: Actualizar tab de venta (líneas ~716–743)**

Reemplazar `<div className="bg-purple-50 border border-purple-200 rounded-xl p-6">` con `<div className="bg-[#F3F7FC] border border-[#DDE6F2] rounded-xl p-6">`

Reemplazar `<h4 className="text-lg font-bold text-purple-900 mb-4">💰 Análisis de Venta</h4>` con `<h4 className="text-lg font-bold text-[#081C3A] mb-4">Análisis de venta</h4>`

Reemplazar todas las `border-purple-200` con `border-[#DDE6F2]`

Reemplazar `border-b-2 border-purple-300` con `border-b-2 border-[#DDE6F2]`

Reemplazar `text-purple-600` con `text-[#0074D9]`

Reemplazar:
```tsx
<div className="flex justify-between py-3 bg-purple-100 rounded-lg px-4 mt-4">
  <span className="font-bold text-lg text-purple-900">Total recibido</span>
  <span className="font-bold text-lg text-purple-900">{formatCurrency(calculoVenta.totalRecibido)}</span>
</div>
```
Con:
```tsx
<div className="flex justify-between py-3 bg-[#F3F7FC] rounded-lg px-4 mt-4">
  <span className="font-bold text-lg text-[#081C3A]">Total recibido</span>
  <span className="font-bold text-lg text-[#0074D9]">{formatCurrency(calculoVenta.totalRecibido)}</span>
</div>
```

Reemplazar `text-green-600` (margen neto) con `text-[#0074D9]`

Reemplazar `<div className="bg-gray-50 border border-gray-200 rounded-xl p-6">` con `<div className="bg-[#F3F7FC] border border-[#DDE6F2] rounded-xl p-6">`

Reemplazar `<h4 className="text-lg font-bold text-gray-900 mb-4">📊 Desglose Impuestos Venta</h4>` con `<h4 className="text-lg font-bold text-[#081C3A] mb-4">Desglose de impuestos — venta</h4>`

- [ ] **Step 8: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

Esperado: sin errores TypeScript ni de compilación.

- [ ] **Step 9: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/calculator/ImportCalculator.tsx
git commit -m "feat: restyle ImportCalculator — GP colors, no emojis, sentence case"
```

---

## Task 7: Página calculadora — wrapper

**Files:**
- Modify: `src/pages/calculadora/index.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/pages/calculadora/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import { ImportCalculator } from '../../components/calculator/ImportCalculator';

const title = "Calculadora de importaciones";
const description = "Calculá todos los costos asociados a tu importación: derechos de aduana, IVA, tasa estadística y gastos de gestión.";
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
>
  <Header />
  <main style="background: #F8FAFC; padding: 64px 0;">
    <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-[#081C3A] mb-4">
          Calculadora de importaciones
        </h1>
        <p class="text-lg text-[#5D6B82] max-w-3xl mx-auto">
          Obtené un desglose detallado de todos los costos asociados a tu importación en Argentina.
          Incluye derechos de aduana, IVA, tasa estadística y gastos de gestión.
        </p>
      </div>

      <ImportCalculator client:load />

      <!-- Info section -->
      <div class="mt-16 max-w-4xl mx-auto">
        <div class="bg-white rounded-xl border border-[#DDE6F2] p-8">
          <h2 class="text-2xl font-bold text-[#081C3A] mb-6">¿Qué incluye el cálculo?</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-base font-semibold text-[#00246B]">Impuestos y tasas</h3>
              <ul class="space-y-2 text-[#5D6B82] text-sm">
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Derechos de importación (según NCM)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>IVA (21% sobre base imponible)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Tasa de estadística (0.5%)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Gastos de gestión aduanera</li>
              </ul>
            </div>
            <div class="space-y-4">
              <h3 class="text-base font-semibold text-[#00246B]">Categorías de productos</h3>
              <ul class="space-y-2 text-[#5D6B82] text-sm">
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Productos generales (14%)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Tecnología / electrónica (8%)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Textil / indumentaria (35%)</li>
                <li class="flex items-start gap-2"><span class="text-[#0074D9] font-bold">·</span>Maquinaria / equipos (12%)</li>
              </ul>
            </div>
          </div>
          <div class="mt-8 p-4 bg-[#F3F7FC] border border-[#DDE6F2] rounded-lg">
            <p class="text-sm text-[#5D6B82]">
              <strong class="text-[#081C3A]">Importante:</strong> Esta calculadora proporciona estimaciones basadas en tasas generales.
              Para importaciones reales, consultá siempre con un despachante de aduanas o profesional del comercio exterior.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/pages/calculadora/index.astro
git commit -m "feat: restyle calculadora page — GP colors, no emojis"
```

---

## Task 8: Página de contacto

**Files:**
- Modify: `src/pages/contacto.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/pages/contacto.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';

const title = "Asesoramiento en importaciones — GIST POINT";
const description = "Contactate con expertos en comercio exterior de GIST POINT. Asesoramiento personalizado en importaciones, aranceles y despacho aduanero.";
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
>
  <Header />
  <main style="background: #F8FAFC; padding: 64px 0;">
    <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">

      <div class="text-center mb-14">
        <h1 class="text-4xl md:text-5xl font-bold text-[#081C3A] mb-4">
          Asesoramiento en importaciones
        </h1>
        <p class="text-lg text-[#5D6B82] max-w-2xl mx-auto">
          Nuestro equipo de expertos en comercio exterior de <strong class="text-[#081C3A]">GIST POINT S.A.S.</strong>
          te ayuda a resolver dudas específicas sobre tu operación de importación.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-10">

        <!-- Info lateral -->
        <div class="space-y-8">
          <div class="bg-white rounded-xl border border-[#DDE6F2] p-8">
            <h2 class="text-xl font-bold text-[#081C3A] mb-6">¿En qué podemos ayudarte?</h2>
            <div class="space-y-5">
              {[
                { title: 'Cálculos de costos', desc: 'Verificación de cálculos y escenarios alternativos', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { title: 'Clasificación NCM', desc: 'Asesoramiento en la correcta clasificación arancelaria', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { title: 'Despacho aduanero', desc: 'Proceso completo y documentación requerida', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                { title: 'Optimización de costos', desc: 'Estrategias para reducir impuestos y gastos', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                { title: 'Orígenes y regímenes', desc: 'Beneficios arancelarios según origen del producto', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
              ].map(item => (
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-[#F3F7FC] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00246B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d={item.icon}/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-[#081C3A] text-sm">{item.title}</h3>
                    <p class="text-[#5D6B82] text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);" class="rounded-xl p-8 text-white">
            <h3 class="text-lg font-bold mb-4">¿Por qué elegir GIST POINT?</h3>
            <ul class="space-y-3">
              {[
                'Especialistas en comercio exterior argentino',
                'Actualizados en normativa vigente',
                'Soluciones personalizadas',
                'Respuesta rápida y eficiente',
              ].map(item => (
                <li class="flex items-center gap-3 text-sm">
                  <span class="text-[#8FE3D5] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-white rounded-xl border border-[#DDE6F2] p-8">
          <h2 class="text-xl font-bold text-[#081C3A] mb-6">Envianos tu consulta</h2>

          <!-- Success -->
          <div id="success-message" class="hidden mb-6 bg-[#F3F7FC] border border-[#DDE6F2] rounded-lg p-6">
            <div class="flex items-center gap-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0074D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <h3 class="font-semibold text-[#081C3A]">¡Mensaje enviado correctamente!</h3>
                <p class="text-[#5D6B82] text-sm mt-1">Te responderemos a la brevedad.</p>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div id="error-message" class="hidden mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 class="font-semibold text-red-800 text-sm">Hubo un error al enviar</h3>
            <p class="text-red-700 text-sm mt-1" id="error-text">Por favor intentá nuevamente.</p>
          </div>

          <form id="contact-form" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-[#081C3A] mb-2">Nombre *</label>
              <input type="text" name="name" required
                class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-[#081C3A] text-sm"
                placeholder="Tu nombre y apellido" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#081C3A] mb-2">Email *</label>
              <input type="email" name="email" required
                class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-[#081C3A] text-sm"
                placeholder="tu@email.com" />
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#081C3A] mb-2">Teléfono</label>
                <input type="tel" name="phone"
                  class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-[#081C3A] text-sm"
                  placeholder="+54 9 351 346-4248" />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#081C3A] mb-2">Empresa</label>
                <input type="text" name="company"
                  class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-[#081C3A] text-sm"
                  placeholder="Tu empresa (opcional)" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#081C3A] mb-2">Asunto *</label>
              <input type="text" name="subject" required
                class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-[#081C3A] text-sm"
                placeholder="¿Sobre qué querés consultar?" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#081C3A] mb-2">Mensaje *</label>
              <textarea rows="5" name="message" required
                class="w-full px-4 py-3 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent resize-none text-[#081C3A] text-sm"
                placeholder="Describí tu consulta con detalle..."></textarea>
            </div>

            <div class="bg-[#F3F7FC] border border-[#DDE6F2] rounded-lg p-4">
              <p class="text-sm text-[#5D6B82]">
                <strong class="text-[#081C3A]">Tip:</strong> Incluí el valor FOB, tipo de producto y origen para una respuesta más precisa.
              </p>
            </div>

            <div class="cf-turnstile" data-sitekey="0x4AAAAAADeRCRs7zuALRlP0"></div>

            <button type="submit" id="submit-btn"
              class="w-full btn btn-primary text-base py-3.5 flex items-center justify-center"
            >
              <span id="btn-text">Enviar consulta</span>
              <svg id="btn-spinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-[#DDE6F2] text-center">
            <p class="text-sm text-[#5D6B82] mb-2">¿Preferís contactarte directamente?</p>
            <a href="mailto:info@gist-point.com" class="text-sm font-semibold text-[#0074D9] hover:text-[#00246B] transition-colors">
              info@gist-point.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>
  <Footer />

  <script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <script>
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      successMessage.classList.add('hidden');
      errorMessage.classList.add('hidden');
      submitBtn.disabled = true;
      btnText.textContent = 'Enviando...';
      btnSpinner.classList.remove('hidden');

      const formData = new FormData(form);
      const data = {};
      formData.forEach((v, k) => { data[k] = v; });
      data.lang = 'es';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok && result.ok) {
          successMessage.classList.remove('hidden');
          form.reset();
          if (window.turnstile) turnstile.reset();
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error(result.error || 'Error al enviar');
        }
      } catch (error) {
        errorMessage.classList.remove('hidden');
        errorText.textContent = error instanceof Error ? error.message : 'Por favor intentá nuevamente.';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Enviar consulta';
        btnSpinner.classList.add('hidden');
      }
    });
  </script>
</BaseLayout>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/pages/contacto.astro
git commit -m "feat: restyle contacto page — GP colors, SVG icons, no emojis"
```

---

## Task 9: Páginas de artículos

**Files:**
- Modify: `src/pages/articulos/index.astro`
- Modify: `src/pages/articulos/[slug].astro`

### 9a — `articulos/index.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `src/pages/articulos/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';

const title = "Guías de importación Argentina — Blog especializado";
const description = "Guías completas y actualizadas sobre importaciones en Argentina. Aprendé sobre aranceles, despacho aduanero, impuestos y logística.";

const articulosCollection = await getCollection('articulos');
const guias = articulosCollection
  .map(entry => ({
    slug: entry.id.replace(/\.md$/, ''),
    title: entry.data.title,
    excerpt: entry.data.description,
    date: entry.data.date,
    category: entry.data.category,
  }))
  .sort((a, b) => b.date.getTime() - a.date.getTime());
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
>
  <Header />
  <main style="background: #F8FAFC; padding: 64px 0;">
    <div style="width: min(100% - 48px, 1180px); margin: 0 auto;">

      <div class="text-center mb-14">
        <h1 class="text-4xl md:text-5xl font-bold text-[#081C3A] mb-4">
          Guías de importación Argentina
        </h1>
        <p class="text-lg text-[#5D6B82] max-w-2xl mx-auto mb-8">
          Recursos especializados para importadores, despachantes y empresas que comercian con el exterior.
          Guías prácticas, actualizaciones normativas y consejos de expertos.
        </p>
        <div class="flex justify-center gap-4 flex-wrap">
          <a href="/calculadora" class="btn btn-primary">Ir a la calculadora</a>
          <a href="/contacto" class="btn btn-outline">Consultar con un experto</a>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-xl border border-[#DDE6F2] p-6 mb-10">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-[#081C3A] mb-2">Buscar guías</label>
            <input
              type="text"
              class="w-full px-4 py-2.5 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-sm text-[#081C3A]"
              placeholder="Escribí un tema (ej: aranceles, NCM, impuestos)..."
              id="searchInput"
            />
          </div>
          <div class="w-full md:w-64">
            <label class="block text-sm font-medium text-[#081C3A] mb-2">Ordenar por</label>
            <select
              class="w-full px-4 py-2.5 border border-[#DDE6F2] rounded-lg focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-sm text-[#081C3A]"
              id="sortSelect"
            >
              <option value="fecha-desc">Más recientes primero</option>
              <option value="fecha-asc">Más antiguos primero</option>
              <option value="titulo">Título (A-Z)</option>
              <option value="categoria">Categoría</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Categorías -->
      <div class="flex flex-wrap justify-center gap-3 mb-10">
        {['Todas', ...new Set(guias.map(g => g.category))].map((cat) => (
          <button
            class="px-4 py-2 bg-white border border-[#DDE6F2] rounded-full text-sm font-medium text-[#5D6B82] hover:bg-[#00246B] hover:text-white hover:border-[#00246B] transition-colors category-btn"
            data-category={cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <!-- Lista de guías -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="guidesList">
        {guias.map((guia) => (
          <article
            class="bg-white rounded-xl border border-[#DDE6F2] overflow-hidden hover:shadow-md transition-shadow guide-item"
            data-category={guia.category}
            data-title={guia.title.toLowerCase()}
            data-date={guia.date.getTime()}
          >
            <div class="p-6">
              <div class="mb-3">
                <span class="px-3 py-1 bg-[#0074D9]/10 text-[#0074D9] text-xs font-semibold rounded-full">
                  {guia.category}
                </span>
              </div>
              <h2 class="text-lg font-bold text-[#081C3A] mb-3 leading-snug">{guia.title}</h2>
              <p class="text-[#5D6B82] text-sm mb-4 leading-relaxed">{guia.excerpt}</p>
              <div class="flex items-center justify-between">
                <time class="text-xs text-[#5D6B82]">
                  {new Date(guia.date).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <a
                  href={`/articulos/${guia.slug}`}
                  class="text-sm font-semibold text-[#0074D9] hover:text-[#00246B] transition-colors"
                >
                  Leer más →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <!-- CTA -->
      <div style="background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);" class="mt-16 rounded-2xl p-10 text-center">
        <h3 class="text-2xl font-bold text-white mb-3">¿Necesitás asesoramiento personalizado?</h3>
        <p class="text-white/75 mb-6 max-w-xl mx-auto">
          Nuestro equipo de expertos en comercio exterior puede ayudarte con dudas específicas
          sobre tu operación de importación.
        </p>
        <a href="/contacto" class="btn btn-secondary px-8 py-3">
          Solicitar asesoramiento
        </a>
      </div>
    </div>
  </main>
  <Footer />
</BaseLayout>

<script>
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const guideItems = document.querySelectorAll('.guide-item');
  let currentCategory = 'Todas';

  function searchGuides() {
    const searchTerm = searchInput.value.toLowerCase();
    guideItems.forEach(item => {
      const title = item.dataset.title;
      const excerpt = item.textContent.toLowerCase();
      const category = item.dataset.category;
      const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
      const matchesCategory = currentCategory === 'Todas' || category === currentCategory;
      item.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
    });
  }

  function sortGuides() {
    const sortValue = sortSelect.value;
    const container = document.getElementById('guidesList');
    const itemsArray = Array.from(guideItems);
    itemsArray.sort((a, b) => {
      switch (sortValue) {
        case 'fecha-desc': return parseInt(b.dataset.date) - parseInt(a.dataset.date);
        case 'fecha-asc':  return parseInt(a.dataset.date) - parseInt(b.dataset.date);
        case 'titulo':     return a.dataset.title.localeCompare(b.dataset.title, 'es-AR');
        case 'categoria':  return a.dataset.category.localeCompare(b.dataset.category, 'es-AR');
        default:           return 0;
      }
    });
    itemsArray.forEach(item => container.appendChild(item));
  }

  function filterByCategory(category) {
    currentCategory = category;
    categoryBtns.forEach(btn => {
      const isActive = btn.dataset.category === category;
      // Usar data-active para la clase CSS definida en el <style> de abajo
      btn.dataset.active = isActive ? 'true' : 'false';
    });
    searchGuides();
  }

  searchInput.addEventListener('input', searchGuides);
  sortSelect.addEventListener('change', sortGuides);
  categoryBtns.forEach(btn => btn.addEventListener('click', () => filterByCategory(btn.dataset.category)));

  // Inicializar estado activo del primer botón (Todas)
  filterByCategory('Todas');
</script>

<style>
  .category-btn[data-active="true"] {
    background: #00246B;
    color: #fff;
    border-color: #00246B;
  }
</style>
```

### 9b — `articulos/[slug].astro`

- [ ] **Step 2: Reemplazar el contenido completo de `src/pages/articulos/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';

export const prerender = true;

export async function getStaticPaths() {
  const blogEntries = await getCollection('articulos');
  return blogEntries.map(entry => ({
    params: { slug: entry.id.replace(/\.md$/, '') },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);

const title = `${entry.data.title} | GIST POINT`;
const description = entry.data.description;

const allArticles = await getCollection('articulos');
const relatedArticles = allArticles.filter(a => a.id !== entry.id).slice(0, 2);
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  image={entry.data.image}
  type="article"
>
  <Header />
  <main style="background: #F8FAFC; padding: 32px 0 64px;">
    <article style="width: min(100% - 48px, 1180px); margin: 0 auto;">
      <div class="lg:grid lg:grid-cols-12 lg:gap-10">

        <!-- Contenido principal -->
        <div class="lg:col-span-8">
          <article class="bg-white rounded-2xl border border-[#DDE6F2] overflow-hidden">
            <header class="p-6 lg:p-10 border-b border-[#DDE6F2]">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-[#0074D9]/10 text-[#0074D9] text-sm font-semibold rounded-full">
                  {entry.data.category}
                </span>
                <time class="text-[#5D6B82] text-sm">
                  {new Date(entry.data.date).toLocaleDateString('es-AR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </time>
              </div>
              <h1 class="text-3xl lg:text-4xl font-bold text-[#00246B] mb-4 leading-tight">
                {entry.data.title}
              </h1>
              <p class="text-lg text-[#5D6B82] mb-6">{entry.data.description}</p>
              <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-[#00246B] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    GP
                  </div>
                  <span class="text-sm font-medium text-[#081C3A]">{entry.data.author}</span>
                </div>
                <div class="flex items-center gap-2 ml-auto">
                  {entry.data.tags.slice(0, 3).map((tag: string) => (
                    <span class="px-2 py-1 bg-[#F3F7FC] text-[#5D6B82] text-xs rounded-md font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <div class="p-6 lg:p-10">
              <div class="prose prose-lg max-w-none">
                <Content />
              </div>
            </div>
          </article>

          <!-- CTA inline -->
          <div style="background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);" class="mt-8 rounded-2xl p-8 text-center">
            <h2 class="text-2xl font-bold text-white mb-3">¿Necesitás ayuda con tu importación?</h2>
            <p class="text-white/75 mb-6 max-w-xl mx-auto text-sm">
              Nuestro equipo de expertos de GIST POINT puede ayudarte con dudas específicas sobre tu operación.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/calculadora" class="btn btn-secondary px-6 py-2.5 text-sm">
                Usar calculadora
              </a>
              <a href="/contacto" class="btn" style="background:rgba(255,255,255,0.15); color:#fff; border:1px solid rgba(255,255,255,0.3);">
                Contactar un experto
              </a>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 mt-8 lg:mt-0">
          <div class="sticky top-[96px] space-y-5">

            <div class="bg-white rounded-2xl border border-[#DDE6F2] p-6">
              <h3 class="text-base font-bold text-[#00246B] mb-4">Sobre este artículo</h3>
              <dl class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <dt class="text-[#5D6B82]">Categoría</dt>
                  <dd class="font-medium text-[#081C3A]">{entry.data.category}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-[#5D6B82]">Autor</dt>
                  <dd class="font-medium text-[#081C3A]">{entry.data.author}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-[#5D6B82]">Publicado</dt>
                  <dd class="font-medium text-[#081C3A]">
                    {new Date(entry.data.date).toLocaleDateString('es-AR', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            <div class="bg-white rounded-2xl border border-[#DDE6F2] p-6">
              <h3 class="text-base font-bold text-[#00246B] mb-4">Herramientas</h3>
              <div class="space-y-3">
                <a href="/calculadora" class="flex items-center gap-3 p-3 rounded-xl bg-[#F3F7FC] hover:bg-[#0074D9]/10 transition-colors group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00246B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <div>
                    <div class="font-medium text-[#081C3A] text-sm group-hover:text-[#0074D9]">Calculadora</div>
                    <div class="text-xs text-[#5D6B82]">Calcular costos</div>
                  </div>
                </a>
                <a href="/contacto" class="flex items-center gap-3 p-3 rounded-xl bg-[#F3F7FC] hover:bg-[#0074D9]/10 transition-colors group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00246B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <div class="font-medium text-[#081C3A] text-sm group-hover:text-[#0074D9]">Consultar</div>
                    <div class="text-xs text-[#5D6B82]">Asesoramiento experto</div>
                  </div>
                </a>
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div class="bg-white rounded-2xl border border-[#DDE6F2] p-6">
                <h3 class="text-base font-bold text-[#00246B] mb-4">Más artículos</h3>
                <div class="space-y-3">
                  {relatedArticles.map((article) => (
                    <a
                      href={`/articulos/${article.id.replace(/\.md$/, '')}`}
                      class="block p-3 rounded-xl hover:bg-[#F3F7FC] transition-colors"
                    >
                      <div class="text-xs text-[#0074D9] font-medium mb-1">{article.data.category}</div>
                      <div class="font-medium text-[#081C3A] text-sm line-clamp-2">{article.data.title}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>
    </article>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verificar build**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1 | tail -20
```

Esperado: 8 páginas generadas, sin errores.

- [ ] **Step 4: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/pages/articulos/index.astro src/pages/articulos/[slug].astro
git commit -m "feat: restyle articulos pages — GP colors, no emojis, sentence case"
```

---

## Task 10: Verificación final y deploy

**Files:** ninguno (solo verificación)

- [ ] **Step 1: Build completo y verificar páginas**

```bash
cd /home/km/Proyectos/calc && npm run build 2>&1
```

Esperado: `8 page(s) built`, sin errores ni warnings críticos.

- [ ] **Step 2: Verificar que no quedan referencias a `text-accent` o `bg-accent` fuera de admin/leads**

```bash
grep -rn "text-accent\|bg-accent\|hover:bg-orange\|text-orange" \
  src/pages src/components src/layouts \
  --include="*.astro" --include="*.tsx" \
  | grep -v "admin/leads"
```

Esperado: sin resultados. Si hay resultados, reemplazarlos con `text-[#0074D9]` o `bg-[#001B4D]` según contexto.

- [ ] **Step 3: Commit final si hubo correcciones, luego push**

```bash
cd /home/km/Proyectos/calc
git push origin main
```
