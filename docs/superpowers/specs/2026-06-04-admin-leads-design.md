# Spec: Página /admin/leads

**Fecha:** 2026-06-04

## Alcance

Crear `src/pages/admin/leads.astro` — port de `gist-point.com/src/pages/admin/leads.astro`.

## Cambios respecto al original

| Elemento | gist-point.com | calc |
|----------|---------------|------|
| `<title>` | `Leads — Gist Point` | `Leads — Calculadora Importaciones` |
| `h1` en login | `Gist Point` | `GIST POINT Calc` |
| `TOKEN_KEY` | `'gist_admin_token'` | `'calc_admin_token'` |

Todo lo demás es idéntico: misma tabla, misma autenticación Bearer, mismo flujo de login/logout, mismo `sessionStorage`, misma paginación, mismo CSS inline.

## Comportamiento

1. Abre `/admin/leads` → pantalla de login
2. Ingresa `ADMIN_TOKEN` → fetch `GET /api/leads` con `Authorization: Bearer <token>`
3. Si 401 → muestra "Token incorrecto"
4. Si ok → guarda token en `sessionStorage('calc_admin_token')` y renderiza tabla
5. Tabla muestra: #, Fecha, Nombre, Email, Teléfono, Empresa, Asunto, Mensaje (truncado), Idioma
6. "Cerrar sesión" borra el token de sessionStorage
7. `meta robots: noindex, nofollow` — no indexable

## Archivo

- Crear: `src/pages/admin/leads.astro`
