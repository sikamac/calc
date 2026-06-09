# Migración calc → stack gist-point.com

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar `calc` a Tailwind v4, output estático, sistema de contacto con D1 + Turnstile + Email Routing (igual que gist-point.com), y actualizar emails/teléfonos/logo.

**Architecture:** Astro con `output: 'static'` genera assets puros en `dist/`. Un `worker.js` independiente intercepta solo `/api/contact` y `/api/leads`; el resto lo sirven los assets directamente (Cloudflare `run_worker_first: false`). Tailwind v4 se integra via `@tailwindcss/vite` sin config file separado.

**Tech Stack:** Astro 5, React 19, Tailwind CSS 4, Cloudflare Workers, Cloudflare D1, Cloudflare Email Routing, Cloudflare Turnstile

---

## Mapa de archivos

| Archivo | Acción |
|---------|--------|
| `package.json` | Modificar: quitar `@astrojs/tailwind`, `@astrojs/cloudflare`; agregar `@tailwindcss/vite`, `wrangler`; mover `@types/*`, `@tailwindcss/typography` a devDeps |
| `astro.config.mjs` | Modificar: quitar tailwind integration + cloudflare adapter, agregar vite plugin, `output: 'static'` |
| `tailwind.config.mjs` | **Eliminar** |
| `src/styles/global.css` | Modificar: reescribir a sintaxis v4 |
| `wrangler.jsonc` | Modificar: `main: worker.js`, agregar D1 y send_email, quitar observability |
| `worker.js` | **Crear**: backend de contacto (D1 + Turnstile + Email) |
| `migrations/0001_create_contacts.sql` | **Crear**: tabla `impocalc_contacts` |
| `src/pages/api/contact.ts` | **Eliminar** |
| `src/pages/contacto.astro` | Modificar: campos del form, envío JSON, agregar Turnstile |
| `src/layouts/BaseLayout.astro` | Modificar: email en JSON-LD |
| `src/components/layout/Footer.astro` | Modificar: email |
| `src/pages/index.astro` | Modificar: email |
| `public/logo.svg` | Reemplazar con logo de gist-point.com |

---

## Task 1: Upgrade Tailwind v3 → v4

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Delete: `tailwind.config.mjs`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Actualizar dependencias**

Reemplazar el contenido completo de `package.json`:

```json
{
  "name": "calc",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "npm run build && wrangler dev",
    "astro": "astro",
    "deploy": "npm run build && wrangler deploy"
  },
  "dependencies": {
    "@astrojs/react": "^4.2.0",
    "@astrojs/sitemap": "^3.7.0",
    "@tailwindcss/vite": "^4.3.0",
    "astro": "^5.2.5",
    "lucide-react": "^0.475.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.3.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.19",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "wrangler": "^4.0.0"
  }
}
```

- [ ] **Step 2: Instalar las nuevas dependencias**

```bash
cd /home/km/Proyectos/calc
npm install
```

Esperado: instalación sin errores. `node_modules/@tailwindcss/vite` debe existir.

- [ ] **Step 3: Actualizar `astro.config.mjs`**

Reemplazar el contenido completo:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://calculadoraimportacion.com.ar',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
    assets: 'assets',
  },
});
```

- [ ] **Step 4: Eliminar `tailwind.config.mjs` y `src/pages/api/contact.ts`**

Estos dos archivos deben eliminarse ANTES del build: `tailwind.config.mjs` porque v4 no usa config file, y `src/pages/api/contact.ts` porque con `output: 'static'` Astro intentaría pre-renderizar el endpoint y fallaría (solo exporta POST, no GET).

```bash
rm /home/km/Proyectos/calc/tailwind.config.mjs
rm /home/km/Proyectos/calc/src/pages/api/contact.ts
rmdir /home/km/Proyectos/calc/src/pages/api/ 2>/dev/null || true
```

- [ ] **Step 5: Reescribir `src/styles/global.css`**

Reemplazar el contenido completo:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #003366;
  --color-secondary: #0066CC;
  --color-accent: #FF6600;
  --font-sans: Inter, system-ui, sans-serif;
}

@layer base {
  html {
    font-family: Inter, system-ui, sans-serif;
    scroll-behavior: smooth;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-accent hover:bg-orange-600 text-white;
  }

  .btn-secondary {
    @apply bg-secondary hover:bg-blue-700 text-white;
  }

  .btn-outline {
    @apply border-2 border-primary text-primary hover:bg-primary hover:text-white;
  }
}

/* Typography plugin customizations (equivalente al tailwind.config.mjs anterior) */
.prose {
  --tw-prose-body: #374151;
  --tw-prose-headings: #003366;
  --tw-prose-links: #FF6600;
  --tw-prose-bold: #003366;
  --tw-prose-code: #003366;
  --tw-prose-quotes: #374151;
  --tw-prose-quote-borders: #FF6600;
  --tw-prose-bullets: #FF6600;
  --tw-prose-counters: #FF6600;
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
  color: #003366;
}

.prose thead {
  background-color: #f3f4f6;
  color: #003366;
}

.prose blockquote {
  background-color: #fff7ed;
  padding: 1rem 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
}
```

- [ ] **Step 6: Verificar que el build funciona**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: `dist/` generado sin errores. Si hay errores de clases Tailwind no reconocidas, revisar que el custom property esté definido en `@theme`.

- [ ] **Step 7: Commit**

```bash
cd /home/km/Proyectos/calc
git add package.json package-lock.json astro.config.mjs src/styles/global.css
git rm tailwind.config.mjs src/pages/api/contact.ts
git commit -m "feat: upgrade Tailwind v4, static output, remove Google Script contact route"
```

---

## Task 2: Actualizar `wrangler.jsonc`

**Files:**
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Reemplazar `wrangler.jsonc`**

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
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "calc-contacts",
      "database_id": "3f512fbf-8a10-42ae-8886-0af21bacb701"
    }
  ],
  "send_email": [
    {
      "name": "EMAIL",
      "destination_address": "gistpoint.international@gmail.com"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/km/Proyectos/calc
git add wrangler.jsonc
git commit -m "feat: update wrangler config for static output with D1 and email"
```

---

## Task 3: Crear `worker.js` y migración D1

> Nota: `src/pages/api/contact.ts` ya fue eliminado en Task 1.

**Files:**
- Create: `worker.js`
- Create: `migrations/0001_create_contacts.sql`

- [ ] **Step 1: Crear `migrations/0001_create_contacts.sql`**

```sql
CREATE TABLE IF NOT EXISTS impocalc_contacts (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  name       TEXT     NOT NULL,
  email      TEXT     NOT NULL,
  phone      TEXT,
  company    TEXT,
  subject    TEXT     NOT NULL,
  message    TEXT     NOT NULL,
  lang       TEXT     NOT NULL DEFAULT 'es',
  created_at TEXT     NOT NULL
);
```

- [ ] **Step 2: Crear `worker.js` en la raíz**

```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    if (url.pathname === '/api/leads' && request.method === 'GET') {
      return handleLeads(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleLeads(request, env) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, name, email, phone, company, subject, message, lang, created_at FROM impocalc_contacts ORDER BY created_at DESC'
  ).all();

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleContact(request, env) {
  const data = await request.json();
  const { name, email, phone, company, subject, message, lang } = data;
  const turnstileToken = data['cf-turnstile-response'];

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: turnstileToken }),
  });
  const verification = await verifyRes.json();
  if (!verification.success) {
    return new Response(JSON.stringify({ error: 'captcha_failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await env.DB.prepare(
    "INSERT INTO impocalc_contacts (name, email, phone, company, subject, message, lang, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  ).bind(
    name.trim(),
    email.trim(),
    phone?.trim() || null,
    company?.trim() || null,
    subject.trim(),
    message.trim(),
    lang || 'es'
  ).run();

  try {
    await env.EMAIL.send({
      to: 'gistpoint.international@gmail.com',
      from: { email: 'info@gist-point.com', name: 'GIST POINT' },
      subject: `Nuevo contacto: ${subject.trim()}`,
      html: `<p><b>Nombre:</b> ${name.trim()}<br><b>Email:</b> ${email.trim()}<br><b>Empresa:</b> ${company?.trim() || '—'}<br><b>Teléfono:</b> ${phone?.trim() || '—'}<br><b>Asunto:</b> ${subject.trim()}<br><b>Mensaje:</b><br>${message.trim()}</p>`,
      text: `Nombre: ${name.trim()}\nEmail: ${email.trim()}\nEmpresa: ${company?.trim() || '—'}\nTeléfono: ${phone?.trim() || '—'}\nAsunto: ${subject.trim()}\nMensaje:\n${message.trim()}`,
    });
  } catch (e) {
    console.error('Email notification failed:', e);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

- [ ] **Step 3: Commit**

```bash
cd /home/km/Proyectos/calc
git add worker.js migrations/0001_create_contacts.sql
git commit -m "feat: add worker.js contact backend with D1 + Turnstile + Email Routing"
```

---

## Task 4: Actualizar formulario `contacto.astro`

**Files:**
- Modify: `src/pages/contacto.astro`

- [ ] **Step 1: Reemplazar el bloque de campos del formulario**

En `src/pages/contacto.astro`, localizar el bloque que empieza en:
```html
<form id="contact-form" class="space-y-6">
  <input type="hidden" name="website" value="">
  
  <div class="grid md:grid-cols-2 gap-4">
```

Reemplazar desde `<form id="contact-form"...>` hasta el cierre `</form>` con:

```html
<form id="contact-form" class="space-y-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
    <input
      type="text"
      name="name"
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      placeholder="Tu nombre y apellido"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
    <input
      type="email"
      name="email"
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      placeholder="tu@email.com"
    />
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
      <input
        type="tel"
        name="phone"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
        placeholder="+54 9 351 346-4248"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
      <input
        type="text"
        name="company"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
        placeholder="Tu empresa (opcional)"
      />
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
    <input
      type="text"
      name="subject"
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
      placeholder="¿Sobre qué querés consultar?"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
    <textarea
      rows="5"
      name="message"
      required
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
      placeholder="Describí tu consulta con detalle..."
    ></textarea>
  </div>

  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p class="text-sm text-blue-800">
      <strong>💡 Tip:</strong> Incluí el valor EXW, tipo de producto y origen para una respuesta más precisa.
    </p>
  </div>

  <div class="cf-turnstile" data-sitekey="0x4AAAAAADeRCRs7zuALRlP0"></div>

  <button
    type="submit"
    id="submit-btn"
    class="w-full btn btn-primary text-lg py-4 rounded-xl flex items-center justify-center"
  >
    <span id="btn-text">📤 Enviar consulta</span>
    <svg id="btn-spinner" class="hidden animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </button>
</form>
```

- [ ] **Step 2: Reemplazar el bloque `<script>` del formulario**

Localizar el bloque `<script>` actual (dentro del `BaseLayout`) que contiene el `form?.addEventListener('submit', ...)`. Reemplazarlo con:

```html
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
      btnText.textContent = '📤 Enviar consulta';
      btnSpinner.classList.add('hidden');
    }
  });
</script>
```

- [ ] **Step 3: Verificar build**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: build exitoso sin errores TypeScript.

- [ ] **Step 4: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/pages/contacto.astro
git commit -m "feat: update contact form to use JSON + Turnstile, align fields with worker.js"
```

---

## Task 5: Actualizar emails, teléfonos y logo

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/layout/Footer.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/contacto.astro`
- Replace: `public/logo.svg`

- [ ] **Step 1: Actualizar email en `src/layouts/BaseLayout.astro`**

En la línea 43, cambiar:
```
"email": "consultas@gistpoint.com"
```
por:
```
"email": "info@gist-point.com"
```

- [ ] **Step 2: Actualizar email en `src/components/layout/Footer.astro`**

Dos cambios:

Cambiar:
```html
href="mailto:consultas@gistpoint.com"
```
por:
```html
href="mailto:info@gist-point.com"
```

Y cambiar el texto visible:
```
consultas@gistpoint.com
```
por:
```
info@gist-point.com
```

- [ ] **Step 3: Actualizar email en `src/pages/index.astro`**

En la línea 256, cambiar:
```html
href="mailto:consultas@gistpoint.com"
```
por:
```html
href="mailto:info@gist-point.com"
```

- [ ] **Step 4: Actualizar email y teléfono en `src/pages/contacto.astro`**

Cambiar el link al pie del formulario:
```html
href="mailto:consultas@gistpoint.com"
```
por:
```html
href="mailto:info@gist-point.com"
```

Y cambiar el texto visible en el mismo lugar:
```
consultas@gistpoint.com
```
por:
```
info@gist-point.com
```

Cambiar el teléfono en la sección de info de contacto:
```
+54 11 XXXX-XXXX
```
por:
```
+54 9 351 346-4248
```

- [ ] **Step 5: Reemplazar `public/logo.svg`**

```bash
cp /home/km/Proyectos/Gist/gist-point.com/public/logo.svg /home/km/Proyectos/calc/public/logo.svg
```

- [ ] **Step 6: Build final**

```bash
cd /home/km/Proyectos/calc
npm run build
```

Esperado: build exitoso.

- [ ] **Step 7: Commit**

```bash
cd /home/km/Proyectos/calc
git add src/layouts/BaseLayout.astro src/components/layout/Footer.astro src/pages/index.astro src/pages/contacto.astro public/logo.svg
git commit -m "feat: update contact info to info@gist-point.com and new logo"
```

---

## Pasos manuales post-implementación (no automatizables)

Estos pasos los ejecuta Kaled después de que el código esté deployado:

**1. Aplicar migración D1 en local (para pruebas):**
```bash
npx wrangler d1 migrations apply calc-contacts --local
```

**2. Aplicar migración D1 en producción:**
```bash
npx wrangler d1 migrations apply calc-contacts --remote
```

**3. Configurar secrets del Worker `calc` en Cloudflare:**
```bash
npx wrangler secret put TURNSTILE_SECRET
# Pegar el mismo valor que en gist — está en el gestor de contraseñas
npx wrangler secret put ADMIN_TOKEN
# Definir un token para /admin/leads de calc
```

**4. Verificar que `gistpoint.international@gmail.com` siga verificado en Email Routing** del dominio `gist-point.com` (ya debería estar, no requiere acción).
