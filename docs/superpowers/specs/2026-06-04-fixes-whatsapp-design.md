# Spec: Fixes UI + WhatsApp

**Fecha:** 2026-06-04

---

## Alcance — 4 cambios

### 1. Favicon
**Problema:** El nuevo `public/logo.svg` (Inkscape SVG con namespaces `sodipodi:`) puede no renderizarse como favicon en algunos navegadores.  
**Fix:** En `src/layouts/BaseLayout.astro`, agregar un segundo tag de fallback:
```html
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<link rel="shortcut icon" href="/logo.svg" />
```

### 2. Botón "Contactar un Experto"
**Problema:** `src/pages/index.astro:255` tiene `href="mailto:info@gist-point.com"` en el CTA principal.  
**Fix:** Cambiar a `href="/contacto"`.  
El Footer "Solicitar Asesoramiento" ya tiene `href="/contacto"` correcto — no tocarlo.

### 3. WhatsApp flotante (todas las páginas)
En `src/layouts/BaseLayout.astro`, agregar justo antes del `</body>`:

```html
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
```

### 4. WhatsApp en Header y Footer

**Header** (`src/components/layout/Header.astro`):

En el nav desktop, agregar antes del último nav item (o después del último):
```html
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
```

En el menú mobile, agregar el mismo ícono en la sección de links del menú.

**Footer** (`src/components/layout/Footer.astro`):

En la columna "¿Necesitás Ayuda?", agregar después del link de email:
```html
<a
  href="https://wa.me/5493513464248"
  target="_blank"
  rel="noopener noreferrer"
  class="block text-center text-green-400 hover:text-green-300 transition-colors font-medium"
>
  💬 WhatsApp
</a>
```

---

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/layouts/BaseLayout.astro` | Favicon fallback + botón flotante WhatsApp |
| `src/pages/index.astro` | Fix href CTA "Contactar un Experto" |
| `src/components/layout/Header.astro` | Ícono WhatsApp en nav desktop y mobile |
| `src/components/layout/Footer.astro` | Link WhatsApp en columna de contacto |
