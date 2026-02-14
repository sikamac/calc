# 🚀 Deploy en Cloudflare Pages - GIST POINT

Guía paso a paso para desplegar la calculadora de importaciones en Cloudflare Pages.

## 📋 Configuración de Build

### Comando de Build
```bash
npm run build
```

**Alternativa (si falla por dependencias):**
```bash
npm install && npm run build
```

### Directorio de Salida (Build Output)
```
/dist
```

**Nota:** Astro genera automáticamente la carpeta `dist/` en la raíz del proyecto.

---

## 🔧 Configuración en Cloudflare Dashboard

### Paso 1: Conectar Repositorio

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Seleccionar tu cuenta
3. Ir a **Pages** → **Create a project**
4. Conectar con **GitHub** (autorizar si es necesario)
5. Seleccionar el repositorio: `sikamac/calc`

### Paso 2: Configurar Build Settings

**Framework preset:** `Astro`

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
/dist
```

**Environment variables (opcional):**
```bash
NODE_VERSION = 20
NPM_VERSION = 10
```

### Paso 3: Configurar Advanced Settings (Recomendado)

**Build comments:**
- ✅ **Build cache:** Habilitar para builds más rápidos
- ✅ **Node.js:** Versión 20
- ✅ **Root directory:** `/` (raíz del proyecto)

**Environment variables (si necesitás):**
```bash
PUBLIC_CONTACT_EMAIL = consultas@gistpoint.com
PUBLIC_SITE_URL = https://tudominio.com
```

---

## 📁 Estructura de Carpetas para Cloudflare

```
C:\Kaold\P\Impo\calc\  ← Root del proyecto
├── dist/                 ← Build output (generado automáticamente)
│   ├── index.html
│   ├── calculadora/
│   │   └── index.html
│   ├── blog/
│   │   └── index.html
│   │   └── 2024-02-15-paso-a-paso-importar-primera-vez/
│   │       └── index.html
│   │   └── 2024-02-10-ncm-clasificacion-arancelaria/
│   │       └── index.html
│   ├── contacto/
│   │   └── index.html
│   └── _astro/           ← Assets estáticos (JS, CSS, imágenes)
├── src/
├── public/
├── package.json
├── astro.config.mjs
└── ...otros archivos de configuración
```

**IMPORTANTE:** No subas la carpeta `dist/` a Git. Ya está en `.gitignore`.

---

## 🌐 Configurar Dominio Personalizado (Opcional)

### Paso 1: Agregar Dominio en Cloudflare

1. En tu proyecto Pages, ir a **Custom domains**
2. Click en **Set up a custom domain**
3. Ingresar tu dominio: `gistpoint.com` o `calculadora.gistpoint.com`
4. Click en **Continue**

### Paso 2: Configurar DNS

Cloudflare te dará 2 registros CNAME:

```dns
Nombre: @ (o subdominio)
Tipo: CNAME
Valor: [tu-proyecto].pages.dev
```

**Ejemplo para dominio principal:**
```dns
Type: CNAME
Name: @
Target: calc.pages.dev
Proxy: ✅ (habilitado)
```

**Ejemplo para subdominio:**
```dns
Type: CNAME
Name: calculadora
Target: calc.pages.dev
Proxy: ✅ (habilitado)
```

### Paso 3: SSL/TLS

- **SSL:** Full (strict)
- **Always Use HTTPS:** ✅ Habilitado
- **Auto Minify:** ✅ Habilitar CSS, JS, HTML

---

## 🚀 Deploy Automático

### Cada vez que hacés push a main:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Cloudflare Pages **detecta automáticamente** el push y:
1. Clona el repositorio
2. Ejecuta `npm run build`
3. Genera la carpeta `/dist`
4. Despliega los archivos estáticos
5. Actualiza el dominio (si está configurado)

**Tiempo estimado:** 30-60 segundos

---

## 🐛 Troubleshooting

### Error: "Build failed"

**Solución:**
```bash
# Verificar que package.json tenga el script
"scripts": {
  "build": "astro build"
}

# O usar comando completo:
npm install && npm run build
```

### Error: "Cannot find module"

**Solución:**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "404 Not Found"

**Solución:**
- Verificar que el build output sea `/dist`
- Asegurar que `astro.config.mjs` tenga `output: 'static'`

---

## 📊 Preview Deployments

Cada **Pull Request** genera una URL de preview:

```
https://[commit-hash].calc.pages.dev
```

Esto permite:
- ✅ Testear antes de mergear
- ✅ Compartir con el equipo
- ✅ Verificar en dispositivos reales

---

## 🎯 Configuraciones Recomendadas

### Build Settings
```yaml
Build command: npm run build
Build output: /dist
Node.js version: 20
Environment variables: (si aplica)
```

### Performance Settings
- ✅ **Auto Minify:** Habilitar CSS, JS, HTML
- ✅ **Brotli:** Habilitar compresión
- ✅ **HTTP/3:** Habilitar (si está disponible)

### Security Settings
- ✅ **SSL:** Full (strict)
- ✅ **HSTS:** Habilitar (31536000 segundos)
- ✅ **Security Headers:** Aplicar automáticamente

---

## 📞 Variables de Entorno Útiles

Si necesitás configurar variables:

```bash
# En Cloudflare Dashboard → Settings → Environment variables

PUBLIC_CONTACT_EMAIL=consultas@gistpoint.com
PUBLIC_API_URL=https://api.gistpoint.com
ANALYTICS_ID=G-XXXXXXXXXX
```

**Acceso en el código:**
```astro
---
const email = import.meta.env.PUBLIC_CONTACT_EMAIL;
---
```

---

## ✅ Checklist Pre-Deploy

- [ ] `npm run build` funciona localmente
- [ ] Carpeta `dist/` se genera correctamente
- [ ] `.gitignore` incluye `dist/`
- [ ] `package.json` tiene script "build"
- [ ] `astro.config.mjs` configurado correctamente
- [ ] Variables de entorno definidas (si aplica)
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL habilitado

---

## 🎉 Primer Deploy

1. **Conectar repositorio** en Cloudflare Pages
2. **Configurar build settings** (ver arriba)
3. **Click en "Save and Deploy"**
4. **Esperar 30-60 segundos**
5. **Acceder a tu URL:** `https://calc.pages.dev`

**¡Listo!** Tu calculadora está online.

---

## 🔗 URLs Importantes

- **Dashboard:** https://dash.cloudflare.com/
- **Proyecto:** https://dash.cloudflare.com/?to=/:account/pages/view/calc
- **Dominio Preview:** https://calc.pages.dev
- **Repo GitHub:** https://github.com/sikamac/calc

---

**¿Necesitás ayuda con el deploy?** Contactanos: consultas@gistpoint.com
