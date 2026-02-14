# 🛠️ Comandos de Uso Diario - Calculadora de Importaciones

Guía rápida de comandos para el día a día en el proyecto.

## 🚀 Desarrollo Local

### Iniciar servidor de desarrollo
```bash
npm run dev          # Inicia dev server en http://localhost:4321
npm run dev -- --host  # Accesible desde tu red local
```

### Build y preview
```bash
npm run build        # Build para producción
npm run preview      # Previsualizar build localmente
```

### Comandos de Astro
```bash
npm run astro -- --help          # Ver todos los comandos de Astro
npm run astro add react         # Añadir integración
npm run astro sync              # Sincronizar content collections
```

---

## 🌿 Git Workflow

### Crear nueva feature
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo
```

### Commits (Conventional Commits)
```bash
git add .
git commit -m "feat: agregar componente X"        # Nueva funcionalidad
git commit -m "fix: corregir bug en Y"            # Corrección de bug
git commit -m "docs: actualizar README"           # Documentación
git commit -m "style: cambiar estilos"            # CSS/estilos
git commit -m "refactor: mejorar código"          # Refactorización
```

### Push y PR
```bash
# Primera vez
git push -u origin feature/nombre

# Siguientes pushes
git push

# Ver estado
git status
git log --oneline -n 5
```

### Merge a main
```bash
git checkout main
git pull origin main
git merge feature/nombre
git push origin main
```

---

## 📦 Dependencias

### Instalar nuevos paquetes
```bash
npm install nombre-paquete              # Producción
npm install -D nombre-paquete           # Dev dependencies
npm install @astrojs/react              # Integración React
npm install lucide-react                # Iconos
```

### Actualizar dependencias
```bash
npm update                              # Actualizar todas
npm update nombre-paquete               # Actualizar específico
npm outdated                            # Ver desactualizadas
```

---

## 🎨 Tailwind CSS

### Clases útiles comunes
```bash
# No son comandos, pero son útiles para recordar:

# Layout
class="flex"                          # Flexbox
class="grid grid-cols-3"              # Grid 3 columnas
class="hidden md:block"               # Responsive

# Espaciado
class="p-4"                           # Padding
class="m-4"                           # Margin
class="space-y-4"                     # Espacio entre hijos

# Colores (personalizados)
class="bg-primary"                    # #003366
class="bg-secondary"                  # #0066CC
class="bg-accent"                     # #FF6600

# Botones
class="btn btn-primary"               # Botón primario
class="btn btn-secondary"             # Botón secundario
class="btn btn-outline"               # Botón outline
```

---

## ☁️ Cloudflare Pages (Deploy)

### Configuración en Dashboard
```yaml
# Build settings:
Framework preset: Astro
Build command: npm run build
Build output directory: /dist
Node.js version: 20
```

### Variables de entorno (si las necesitás)
```bash
# En Cloudflare Dashboard → Pages → Settings → Environment variables
PUBLIC_CONTACT_EMAIL=contacto@tudominio.com
PUBLIC_API_URL=https://api.tudominio.com
```

### Deploy manual (si es necesario)
```bash
# Cloudflare Wrangler (instalar primero)
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist --project-name=calc
```

---

## 🗂️ Content Collections (Noticias)

### Crear nueva noticia
```bash
# Crear archivo en src/content/news/
# Nombre: YYYY-MM-DD-titulo.md

# Ejemplo de contenido:
---
title: "Nueva reglamentación aduanera"
date: 2024-02-15
category: "regulaciones"
image: "/images/news/imagen.jpg"
description: "Descripción breve"
---

Contenido de la noticia...
```

### Sincronizar collections
```bash
npm run astro sync
```

---

## 🔍 Testing y QA

### Lighthouse (Chrome DevTools)
```bash
# En Chrome:
# 1. F12 → Lighthouse tab
# 2. Generate report
# 3. Verificar: Performance, SEO, Accessibility
```

### Mobile responsive test
```bash
# En Chrome DevTools:
# 1. F12 → Toggle device toolbar (Ctrl+Shift+M)
# 2. Probar diferentes dispositivos
```

---

## 🐛 Troubleshooting

### Si `npm run dev` no funciona
```bash
# Limpiar caché
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar puerto
netstat -ano | findstr :4321    # Si está ocupado
```

### Si el build falla
```bash
# Ver errores detallados
npm run build -- --verbose

# Limpiar dist
rm -rf dist

# Rebuild
npm run build
```

### Si Tailwind no aplica estilos
```bash
# Verificar que global.css está importado
# En tus archivos .astro:
---
import '../styles/global.css';
---

# Reiniciar dev server
Ctrl+C
npm run dev
```

### Si React no funciona
```bash
# Verificar integración
npx astro add react --yes

# Verificar tsconfig.json
# Debe tener: "jsx": "react-jsx"
```

---

## 📝 Comandos de Git Útiles

### Ver historial
```bash
git log --oneline -n 10                    # Últimos 10 commits
git log --graph --oneline --all            # Historial gráfico
git show commit-hash                       # Ver detalle de commit
```

### Manejo de ramas
```bash
git branch                                 # Ver ramas locales
git branch -a                             # Ver todas las ramas
git branch -d nombre-rama                 # Eliminar rama local
git push origin --delete nombre-rama      # Eliminar rama remota
```

### Stash (guardar cambios temporales)
```bash
git stash                                  # Guardar cambios
git stash list                             # Ver stash list
git stash pop                              # Recuperar último stash
git stash drop                             # Eliminar último stash
```

### Reset (cuidado - elimina commits)
```bash
git reset --soft HEAD~1                    # Deshacer último commit (conserva cambios)
git reset --hard HEAD~1                    # Deshacer último commit (elimina cambios)
```

---

## 📊 Comandos de Windows (PowerShell)

### Ver procesos (si necesitás matar un puerto)
```powershell
# Ver qué usa el puerto 4321
Get-Process -Id (Get-NetTCPConnection -LocalPort 4321).OwningProcess

# Matar proceso por PID
Stop-Process -Id PID -Force
```

### Crear archivos rápido
```powershell
New-Item -ItemType File -Path "src/components/Nuevo.astro"
```

### Ver árbol de carpetas
```powershell
tree /f src
```

---

## 🎯 Atajos de Teclado (VS Code)

```bash
# Mientras editás:
Ctrl+Shift+P          # Command Palette
Ctrl+`                # Abrir terminal
Ctrl+Shift+E          # Explorador de archivos
Ctrl+P                # Buscar archivo
Ctrl+Shift+F          # Buscar en proyecto
Alt+Click             # Cursor múltiple
Ctrl+/                # Comentar/descomentar línea
```

---

## ✅ Pre-Commit Checklist

Antes de hacer push, verificá:

```bash
# 1. Build funciona
npm run build

# 2. No hay errores de TypeScript
# (el build de Astro ya lo verifica)

# 3. Formatear código (si tenés Prettier)
npm run format

# 4. Linting (si tenés ESLint)
npm run lint

# 5. Ver cambios
git status
git diff

# 6. Commit con mensaje claro
git add .
git commit -m "feat: descripción clara"

# 7. Push
git push origin feature/nombre
```

---

## 📞 Si todo falla...

```bash
# Último recurso: reset completo
# (guardá tus cambios primero con git stash o copiando archivos)

rm -rf node_modules dist package-lock.json
npm cache clean --force
git clean -fd
npm install
npm run dev
```

---

## 🎉 Comandos para deploy final

```bash
# 1. Última verificación
git checkout main
git pull origin main
npm run build

# 2. Merge de feature
git merge feature/nombre-feature

# 3. Push a producción
git push origin main

# 4. Cloudflare Pages deploya automáticamente
# Verificar en: Cloudflare Dashboard → Pages → Deployments
```

---

**Guardá este archivo para referencia rápida. ¡Éxitos con el proyecto!** 🚀
