# 🧮 Calculadora de Importaciones Argentina

Web app para calcular costos de importación en Argentina. Construida con Astro, React y TypeScript, optimizada para SEO y performance.

## 🚀 Tecnologías

- **Framework:** Astro 5.x
- **Frontend:** React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Despliegue:** Cloudflare Pages
- **Contenido:** Markdown Collections

## 📋 Características

- ✅ Cálculo de costos de importación (aranceles, impuestos, etc.)
- ✅ Interfaz en español optimizada para el mercado argentino
- ✅ Sistema de noticias con contenido en markdown
- ✅ SEO completo (meta tags, Open Graph, JSON-LD)
- ✅ Diseño responsive y mobile-first
- ✅ Performance optimizada (Core Web Vitals)

## 🏗️ Estructura del Proyecto

```
calc/
├── src/
│   ├── components/     # Componentes Astro y React
│   ├── content/        # Noticias en markdown
│   ├── layouts/        # Layouts base
│   ├── pages/          # Páginas del sitio
│   └── styles/         # Estilos globales
├── public/             # Assets estáticos
├── scripts/            # Scripts de utilidad
└── docs/               # Documentación
```

## 🛠️ Desarrollo

### Requisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/sikamac/calc.git
cd calc

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles

```bash
npm run dev          # Iniciar dev server (localhost:4321)
npm run build        # Build para producción
npm run preview      # Previsualizar build
npm run astro ...    # Comandos de Astro CLI
```

## 🌿 Git Workflow

Usamos **Conventional Commits** y ramas feature:

```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Desarrollar y commitear
git add .
git commit -m "feat: agregar componente X"

# Push y PR
git push origin feature/nueva-funcionalidad
# Crear Pull Request en GitHub
```

**Convenciones:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Estilos/CSS
- `refactor:` Refactorización

Ver [GIT-WORKFLOW.md](./GIT-WORKFLOW.md) para más detalles.

## ☁️ Despliegue

### Cloudflare Pages

1. Conectar repositorio en [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Configurar build:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output:** `/dist`
3. Configurar dominio personalizado
4. Deploy automático en cada push a `main`

### Build Settings

```yaml
Node.js version: 20
Environment variables: (si aplica)
  - PUBLIC_CONTACT_EMAIL
  - PUBLIC_API_URL
```

## 📱 Performance

Objetivos de Core Web Vitals:
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

Optimizaciones implementadas:
- Imágenes optimizadas con `astro:assets`
- CSS crítico inline
- JavaScript mínimo (solo React en componentes interactivos)
- Fonts locales
- Prefetch de recursos críticos

## 🔍 SEO

- Meta tags optimizados en español
- Open Graph y Twitter Cards
- Schema.org JSON-LD
- URLs amigables
- Sitemap automático
- Robots.txt configurado

## 📝 Contenido

### Noticias

Agregar noticias en `src/content/news/`:

```markdown
---
title: "Nueva reglamentación"
date: 2024-01-15
category: "regulaciones"
image: "/images/news/imagen.jpg"
description: "Descripción breve"
---

Contenido aquí...
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Email:** contacto@tudominio.com
- **Issues:** [GitHub Issues](https://github.com/sikamac/calc/issues)

---

**Documentación completa:** Ver [PLANIFICACION.md](./PLANIFICACION.md)
