# 🚀 Deploy en Cloudflare Pages - GIST POINT

Guía paso a paso para desplegar la calculadora de importaciones en Cloudflare Pages, incluyendo configuración del backend PHP.

## 📋 Configuración de Build

### Comando de Build
```bash
npm run build
```

**Funcionamiento del comando:**
1. Construye la aplicación Astro
2. Instala dependencias PHP con Composer
3. Copia archivos backend al directorio dist/
4. Prepara todo para el deploy

### Directorio de Salida (Build Output)
```
/dist
```

**Estructura del dist/ generado:**
```
dist/
├── _astro/                 # Assets estáticos (JS, CSS, imágenes)
├── articulos/              # Páginas de blog
├── calculadora/            # Calculadora principal
├── contacto/               # Formulario de contacto
├── config/                 # Configuración (variables de entorno)
├── email_templates/        # Plantillas de emails
├── vendor/                 # Dependencias PHP (PHPMailer + phpdotenv)
├── form-handler.php        # Manejador del formulario
├── index.html              # Página de inicio
├── logo.svg                # Logo
├── robots.txt              # Robots.txt
├── sitemap-0.xml           # Sitemap
└── sitemap-index.xml       # Índice del sitemap
```

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

### Paso 4: Variables de Entorno (Backend PHP)

Configurar **variables secretas** en Cloudflare Pages → Settings → Environment variables. Estas variables se usan para el envío de emails.

**Variables Obligatorias (SMTP):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SENDER_SMTP_USER=tu-email@gmail.com
SENDER_SMTP_PASS=tu-contraseña-app
IMPORT_FROM_NAME=GIST POINT S.A.S.
IMPORT_TO_ADDRESS=consultas@gistpoint.com
```

**Variables Opcionales:**
```bash
RATE_LIMIT_SECONDS=30
SESSION_TIMEOUT=1800
LOG_FILE=contact-submissions.log
LOG_LEVEL=info
ENABLE_AUTOREPLY=true
ENABLE_ADMIN_EMAIL=true
ENABLE_LOGGING=true
DEBUG=false
ERROR_REPORTING=1
```

**PHP Version (Requerido):**
```bash
PHP_VERSION=8.1
```

---

## 📁 Estructura de Carpetas para Cloudflare

```
/home/km/Proyectos/calc/  ← Root del proyecto
├── dist/                 ← Build output (generado automáticamente)
│   ├── index.html
│   ├── calculadora/
│   │   └── index.html
│   ├── articulos/         ← Páginas de blog
│   │   └── index.html
│   │   └── paso-a-paso-importar-primera-vez/
│   │       └── index.html
│   │   └── ncm-clasificacion-arancelaria/
│   │       └── index.html
│   ├── contacto/
│   │   └── index.html
│   ├── config/            ← Configuración (variables de entorno)
│   │   └── .env.example
│   ├── email_templates/   ← Plantillas de emails
│   │   └── import_consultation_admin.txt
│   │   └── import_consultation_autoreply.txt
│   ├── vendor/            ← Dependencias PHP
│   ├── form-handler.php   ← Manejador del formulario
│   └── _astro/           ← Assets estáticos (JS, CSS, imágenes)
├── src/                   ← Código fuente de Astro
├── public/                ← Archivos estáticos
├── package.json
├── composer.json          ← Dependencies PHP
├── composer.lock          ← Versiones exactas de dependencias
├── composer.phar          ← Composer local
├── form-handler.php       ← Manejador del formulario
└── astro.config.mjs
```

**Archivos a ignorar (gitignore):**
```
vendor/
email_templates/*.log
contact-submissions.log
config/*.env
.env
```

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
- Verificar que el archivo `form-handler.php` esté en la raíz de dist/

### Error: "PHP Fatal error"

**Solución:**
- Verificar que PHP_VERSION esté configurado a 8.1
- Verificar que el vendor folder exista en dist/vendor/
- Verificar que las variables de entorno estén definidas

### Error: "SMTP Connection Failed"

**Solución:**
- Verificar credenciales SMTP en Cloudflare Pages
- Usar App Password para Gmail (no contraseña normal)
- Verificar que el puerto 587 esté abierto
- Probar con SMTP_ENCRYPTION=tls

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

### General
- [ ] `npm run build` funciona localmente
- [ ] Carpeta `dist/` se genera correctamente
- [ ] `.gitignore` incluye `dist/`
- [ ] `package.json` tiene script "build"
- [ ] `astro.config.mjs` configurado correctamente

### Backend PHP
- [ ] `composer install` funciona
- [ ] Vendor folder se crea en dist/
- [ ] Form-handler.php está en dist/
- [ ] Email templates están en dist/email_templates/
- [ ] Config folder está en dist/config/

### Variables de Entorno
- [ ] Variables SMTP definidas en Cloudflare Pages
- [ ] PHP_VERSION=8.1 definido
- [ ] Credenciales de SMTP son válidas (App Password para Gmail)

### Deploy
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL habilitado
- [ ] Build command correcto: `npm run build`
- [ ] Output directory: `/dist`

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
