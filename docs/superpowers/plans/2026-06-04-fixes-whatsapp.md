# UI Fixes + WhatsApp Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir favicon, botón CTA roto, y agregar WhatsApp flotante + en header y footer.

**Architecture:** Cambios quirúrgicos en 4 archivos Astro existentes. El botón flotante va en `BaseLayout.astro` para aparecer en todas las páginas. Los íconos de header y footer van en sus respectivos componentes.

**Tech Stack:** Astro 5, Tailwind CSS 4, SVG inline

---

## Mapa de archivos

| Archivo | Cambio |
|---------|--------|
| `src/layouts/BaseLayout.astro` | Favicon fallback + botón flotante WhatsApp |
| `src/pages/index.astro` | Fix href CTA "Contactar un Experto" |
| `src/components/layout/Header.astro` | Ícono WhatsApp desktop + mobile |
| `src/components/layout/Footer.astro` | Link WhatsApp en columna de contacto |

---

## Task 1: Favicon fallback + fix botón CTA

**Files:**
- Modify: `src/layouts/BaseLayout.astro:87`
- Modify: `src/pages/index.astro:256`

- [ ] **Step 1: Agregar favicon fallback en `src/layouts/BaseLayout.astro`**

Localizar línea 87:
```html
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
```

Reemplazar con:
```html
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="shortcut icon" href="/logo.svg" />
```

- [ ] **Step 2: Fix href del CTA en `src/pages/index.astro`**

Localizar (alrededor de línea 255-260):
```html
        <a
          href="mailto:info@gist-point.com"
          class="btn bg-accent hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl inline-block"
        >
          📞 Contactar un Experto
        </a>
```

Cambiar `href="mailto:info@gist-point.com"` a `href="/contacto"`:
```html
        <a
          href="/contacto"
          class="btn bg-accent hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl inline-block"
        >
          📞 Contactar un Experto
        </a>
```

- [ ] **Step 3: Verificar build**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: 7 páginas generadas sin errores.

- [ ] **Step 4: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "fix: favicon fallback and CTA button href to /contacto"
```

---

## Task 2: Botón flotante WhatsApp (todas las páginas)

**Files:**
- Modify: `src/layouts/BaseLayout.astro:94-96`

- [ ] **Step 1: Agregar botón flotante en `src/layouts/BaseLayout.astro`**

Localizar:
```html
  <body class="bg-white text-gray-900 antialiased">
    <slot />
  </body>
```

Reemplazar con:
```html
  <body class="bg-white text-gray-900 antialiased">
    <slot />

    <!-- WhatsApp flotante -->
    <a
      href="https://wa.me/5493513464248"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultanos por WhatsApp"
      class="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors group relative"
    >
      <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="absolute right-16 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Consultanos por WhatsApp
      </span>
    </a>
  </body>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: build exitoso.

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/layouts/BaseLayout.astro
git commit -m "feat: add floating WhatsApp button"
```

---

## Task 3: WhatsApp en Header

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Agregar ícono WhatsApp en nav desktop**

Localizar el bloque del nav desktop (líneas 35-53):
```html
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-2">
          {navItems.map((item) => (
            <a
              href={item.href}
              class:list={[...]}
              aria-current={...}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
```

Reemplazar con:
```html
      <!-- Desktop Navigation -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-2">
          {navItems.map((item) => (
            <a
              href={item.href}
              class:list={[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                {
                  'text-white bg-primary': currentPath === item.href,
                  'text-gray-700 hover:text-primary hover:bg-gray-100': currentPath !== item.href,
                },
              ]}
              aria-current={currentPath === item.href ? 'page' : false}
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://wa.me/5493513464248"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            class="p-2 text-gray-600 hover:text-green-600 transition-colors flex items-center"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
```

- [ ] **Step 2: Agregar ícono WhatsApp en menú mobile**

Localizar el bloque del menú mobile (líneas 73-92):
```html
    <!-- Mobile Navigation -->
    <div class="md:hidden hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {navItems.map((item) => (
          <a ...>{item.label}</a>
        ))}
      </div>
    </div>
```

Reemplazar con:
```html
    <!-- Mobile Navigation -->
    <div class="md:hidden hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {navItems.map((item) => (
          <a
            href={item.href}
            class:list={[
              'block px-3 py-2 rounded-md text-base font-medium',
              {
                'text-primary bg-primary/10': currentPath === item.href,
                'text-gray-700 hover:text-primary hover:bg-gray-100': currentPath !== item.href,
              },
            ]}
            aria-current={currentPath === item.href ? 'page' : false}
          >
            {item.label}
          </a>
        ))}
        <a
          href="https://wa.me/5493513464248"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
```

- [ ] **Step 3: Verificar build**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: build exitoso sin errores.

- [ ] **Step 4: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/layout/Header.astro
git commit -m "feat: add WhatsApp icon to header nav desktop and mobile"
```

---

## Task 4: WhatsApp en Footer

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Agregar link WhatsApp en columna "¿Necesitás Ayuda?"**

Localizar en `src/components/layout/Footer.astro` el bloque (líneas 41-54):
```html
        <div class="space-y-3">
          <a 
            href="/contacto" 
            class="block w-full text-center btn btn-primary whitespace-nowrap mb-2"
          >
            📧 Solicitar Asesoramiento
          </a>
          <a
            href="mailto:info@gist-point.com"
            class="block text-center text-accent hover:text-orange-600 transition-colors font-medium"
          >
            info@gist-point.com
          </a>
        </div>
```

Reemplazar con:
```html
        <div class="space-y-3">
          <a 
            href="/contacto" 
            class="block w-full text-center btn btn-primary whitespace-nowrap mb-2"
          >
            📧 Solicitar Asesoramiento
          </a>
          <a
            href="mailto:info@gist-point.com"
            class="block text-center text-accent hover:text-orange-600 transition-colors font-medium"
          >
            info@gist-point.com
          </a>
          <a
            href="https://wa.me/5493513464248"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
```

- [ ] **Step 2: Verificar build**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: build exitoso.

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/components/layout/Footer.astro
git commit -m "feat: add WhatsApp link to footer"
```
