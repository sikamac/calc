# Guía de Git Workflow - Calculadora de Importaciones

## 🌿 Estrategia de Ramas

### Ramas Principales
- **`main`** → Producción (Cloudflare Pages auto-deploy)
- **`develop`** → Pre-producción (opcional, para testing)
- **`feature/nombre-descriptivo`** → Features individuales

## 🔄 Flujo de Trabajo Diario

### 1. Iniciar Nueva Feature
```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama feature
git checkout -b feature/nombre-descriptivo
# Ejemplos:
# git checkout -b feature/calculadora-basica
# git checkout -b feature/header-component
# git checkout -b feature/seo-meta-tags
```

### 2. Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar cambios
npm run build    # Asegurar que build funciona
npm run preview  # Previsualizar build

# Formatear código (si tienes prettier)
npm run format

# Linting (si tienes eslint)
npm run lint
```

### 3. Commits (Conventional Commits)
```bash
# Formato: tipo(scope): descripción
# Tipos: feat, fix, docs, style, refactor, test, chore

git add .
git commit -m "feat: componente Header con navegación responsive"
git commit -m "fix: corregir cálculo de IVA en calculadora"
git commit -m "docs: agregar documentación de SEO"
git commit -m "style: actualizar paleta de colores"
```

### 4. Push y Pull Request
```bash
# Primera vez: push con upstream
git push -u origin feature/nombre-descriptivo

# Siguientes pushes
git push

# Crear Pull Request en GitHub
# - Template: describir cambios
# - Asignar reviewers (si aplica)
# - Link a issues (si aplica)
```

### 5. Merge a Main
```bash
# Opción A: Merge desde GitHub (recomendado)
# - Crear PR en GitHub
# - Revisar cambios
# - Merge pull request

# Opción B: Merge local
git checkout main
git pull origin main
git merge feature/nombre-descriptivo
git push origin main

# Eliminar rama feature después del merge
git branch -d feature/nombre-descriptivo
git push origin --delete feature/nombre-descriptivo
```

## 🚀 Comandos Útiles

### Git Status
```bash
git status                  # Estado actual
git log --oneline -n 10     # Últimos 10 commits
git branch                  # Ver ramas locales
git branch -a              # Ver todas las ramas
```

### Sync con Remote
```bash
git fetch origin           # Traer cambios sin merge
git pull origin main       # Traer y mergear main
git remote -v              # Ver remotos
```

### Manejo de Conflictos
```bash
git merge feature/xyz      # Si hay conflictos...
# Editar archivos conflictivos
# Buscar "<<<<<" y resolver
git add archivo-resuelto.txt
git commit -m "fix: resolver conflictos de merge"
```

### Stash (guardar cambios temporales)
```bash
git stash                  # Guardar cambios
git stash pop              # Recuperar cambios
```

## 📋 Pull Request Template

Crear archivo: `.github/pull_request_template.md`

```markdown
## 📝 Descripción
Breve descripción de los cambios

## 🎯 Tipo de cambio
- [ ] Feature nueva
- [ ] Bug fix
- [ ] Documentación
- [ ] Refactorización

## 📸 Screenshots (si aplica)
[Adjuntar imágenes]

## ✅ Checklist
- [ ] Testeado localmente
- [ ] Build funciona (`npm run build`)
- [ ] Código formateado
- [ ] Commits siguen conventional commits

## 🔗 Issues relacionados
Closes #123
```

## 🚫 Qué NO hacer

- ❌ No commitear directo a `main`
- ❌ No mergear PRs sin revisión (si es equipo)
- ❌ No dejar ramas feature viejas
- ❌ No pushear secrets o .env
- ❌ No commitear node_modules

## 🎉 Releases (Opcional)

Para versiones:
```bash
# Crear tag de versión
git tag -a v1.0.0 -m "Primera versión estable"
git push origin v1.0.0

# Listar tags
git tag -l
```

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Astro Deploy Docs](https://docs.astro.build/en/guides/deploy/cloudflare/)
