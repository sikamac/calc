# Spec: Migración calc → stack gist-point.com

**Fecha:** 2026-06-04  
**Repo:** `/home/km/Proyectos/calc`  
**Referencia:** `/home/km/Proyectos/Gist/gist-point.com`

---

## Contexto

El repo `calc` (calculadoraimportacion.com.ar) es un sitio Astro con Tailwind v3, modo SSR (`output: 'server'`) y un sistema de contacto basado en Google Apps Script. Se migra al mismo stack que `gist-point.com`: Tailwind v4, output estático, sistema de contacto con Cloudflare D1 + Turnstile + Email Routing.

---

## Alcance — 5 grupos de cambios

### 1. Tailwind v3 → v4

**Qué cambia:**
- Eliminar dependencia `@astrojs/tailwind` y archivo `tailwind.config.mjs`
- Agregar `@tailwindcss/vite` como Vite plugin en `astro.config.mjs`
- `src/styles/global.css`: reemplazar directivas `@tailwind base/components/utilities` por `@import "tailwindcss"` + bloque `@theme {}` con los colores actuales de calc
- Los colores actuales se mapean al sistema de tokens de Tailwind v4:
  - `primary: #003366`, `secondary: #0066CC`, `accent: #FF6600`
- Las clases `@layer components` (`.btn`, `.btn-primary`, etc.) se mantienen

**Archivos afectados:**
- `package.json`
- `astro.config.mjs`
- `tailwind.config.mjs` (eliminar)
- `src/styles/global.css`

### 2. output: server → static

**Qué cambia:**
- `astro.config.mjs`: `output: 'server'` → `output: 'static'`, eliminar adapter cloudflare, mantener `sitemap()` sin cambios (ya es mono-idioma)
- `package.json`: script `build` deja de necesitar el `&& echo '_worker.js' > dist/.assetsignore` → queda `"astro build"`. Agregar script `"deploy": "npm run build && wrangler deploy"`. Eliminar dependencia `@astrojs/cloudflare`.
- `wrangler.jsonc`: `main` cambia de `dist/_worker.js` a `worker.js`

**Archivos afectados:**
- `astro.config.mjs`
- `package.json`
- `wrangler.jsonc`

### 3. Sistema de contacto — backend

**Qué se elimina:**
- `src/pages/api/contact.ts` — implementación Google Script (GOOGLE_SCRIPT_URL, FormData, honeypot, origin check)

**Qué se crea:**
- `worker.js` (raíz) — maneja `/api/contact` (POST) y `/api/leads` (GET), delega assets a ASSETS binding. Basado en gist-point con:
  - Tabla: `impocalc_contacts`
  - Email from: `info@gist-point.com` / name: `GIST POINT`
  - Email to: `gistpoint.international@gmail.com`
  - Turnstile verification via `TURNSTILE_SECRET` (Cloudflare secret)
  - Admin leads protegidos por `ADMIN_TOKEN` (Cloudflare secret)
- `migrations/0001_create_contacts.sql` — crea tabla `impocalc_contacts` con campos: id, name, email, phone, company, subject, message, lang, created_at

**`wrangler.jsonc` final:**
```jsonc
{
  "name": "calc",
  "main": "worker.js",
  "compatibility_date": "2026-03-06",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "run_worker_first": false
  },
  "d1_databases": [{
    "binding": "DB",
    "database_name": "calc-contacts",
    "database_id": "3f512fbf-8a10-42ae-8886-0af21bacb701"
  }],
  "send_email": [{
    "name": "EMAIL",
    "destination_address": "gistpoint.international@gmail.com"
  }]
}
```

**Secrets requeridos en Cloudflare (ya existen en gist-point, verificar para calc):**
```bash
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put ADMIN_TOKEN
```

### 4. Formulario `contacto.astro`

**Campos que cambian:**
- `first_name` + `last_name` → campo único `name`
- `query_type` (select con opciones) → campo `subject` (texto libre)
- Agregar campo `company` (opcional)
- Eliminar honeypot field `website`

**Envío que cambia:**
- `FormData` → `JSON.stringify({ name, email, phone, company, subject, message, lang: 'es' })`
- Header `Content-Type: application/json`
- Leer `cf-turnstile-response` del formulario e incluirlo en el JSON

**Turnstile que se agrega:**
- `<div class="cf-turnstile" data-sitekey="0x4AAAAAADeRCRs7zuALRlP0"></div>`
- Script: `<script is:inline src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
- En reset del form: llamar `turnstile.reset()` si `window.turnstile` existe

**Lo que NO cambia:**
- Sección informativa izquierda (bullets de servicios, "¿Por qué GIST POINT?")
- Estilos, layout, mensajes de éxito/error
- Estructura general de la página

### 5. Emails, teléfonos y logo

**Email:** `consultas@gistpoint.com` → `info@gist-point.com`
- `src/layouts/BaseLayout.astro` (JSON-LD schema)
- `src/components/layout/Footer.astro` (href + texto)
- `src/pages/index.astro` (CTA mailto)
- `src/pages/contacto.astro` (link directo al pie del formulario)

**Teléfono:** `+54 11 XXXX-XXXX` → `+54 9 351 346-4248`
- `src/pages/contacto.astro` (sección info de contacto)

**Logo:** Reemplazar `public/logo.svg` con el archivo de gist-point.com (114 líneas, formato Inkscape SVG)
- `src/components/ui/Logo.tsx` (SVG inline React) **no se toca** — no se usa en Header ni Footer directamente

---

## Dependencias entre grupos

```
[1 Tailwind v4] → independiente
[2 Static output] → debe ir antes de [3 worker.js] para que wrangler.jsonc sea consistente
[3 Backend contacto] → depende de [2]
[4 Formulario] → depende de [3] (campos deben coincidir con lo que espera el worker)
[5 Emails/logo] → independiente, puede ir en cualquier momento
```

Orden de implementación recomendado: 1 → 2 → 3 → 4 → 5

---

## Post-implementación: pasos manuales requeridos

1. Aplicar migración D1 local: `npx wrangler d1 migrations apply calc-contacts --local`
2. Aplicar migración D1 remoto: `npx wrangler d1 migrations apply calc-contacts --remote`
3. Verificar/configurar secrets en Cloudflare Worker `calc`:
   ```bash
   npx wrangler secret put TURNSTILE_SECRET
   npx wrangler secret put ADMIN_TOKEN
   ```
4. Verificar que `gistpoint.international@gmail.com` esté verificado en Email Routing del dominio `gist-point.com` (ya debería estarlo)
