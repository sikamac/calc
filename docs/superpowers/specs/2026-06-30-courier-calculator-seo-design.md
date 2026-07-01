# Diseño: Calculadora Courier + Mejoras SEO

**Fecha:** 2026-06-30  
**Proyecto:** calculadoraimportacion.com.ar  
**Estado:** Aprobado por Kaled

---

## Contexto

La web ya tiene calculadora de importación formal, blog con 10 artículos y SEO técnico bien configurado. Sin embargo, carece de una herramienta específica para el régimen courier (puerta a puerta), que es el caso de uso más buscado por consumidores finales ("cuánto IVA Shein", "franquicia courier Argentina"). Esta es la principal ventaja de Servidos.ar sobre la que podemos diferenciarnos.

La IA externa que analizó el sitio identificó correctamente la ausencia de la calculadora courier. Otros puntos del análisis (blog, schema, meta tags) ya están implementados.

---

## Alcance

### Fase 1 — Esta sesión
1. Calculadora courier en `/calculadora/courier`
2. Quick wins SEO en la landing (FAQ sync + 2 FAQs nuevos + mejora meta `/calculadora`)

### Fase 2 — Próximo PR
- Página de comparación `/courier-vs-formal` con ambas calculadoras en paralelo (detallada al final del documento)

---

## Fase 1 — Diseño detallado

### Archivos nuevos

| Archivo | Propósito |
|---|---|
| `src/lib/courier-calculation.ts` | Lógica pura de cálculo courier |
| `src/components/calculator/CourierCalculator.tsx` | Componente React de la calculadora |
| `src/pages/calculadora/courier.astro` | Página pública con SEO propio |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/pages/index.astro` | Agregar 4ta Q&A al FAQPage schema + 2 FAQs courier en HTML |
| `src/pages/calculadora/index.astro` | Mejorar `description` meta |

---

### 1. Lógica de cálculo (`courier-calculation.ts`)

Sigue el mismo patrón que `import-calculation.ts`: interfaz de input → función pura → interfaz de output.

**Reglas del régimen (fuente: artículo propio + normativa vigente):**

- Franquicia: USD 400 por envío
- Límite: USD 3.000 por envío (50 kg máx)
- Envíos anuales: 5 por persona humana con CUIT/CUIL
- Unidades misma especie: máximo 3 por envío
- Destinatario: solo personas humanas (la franquicia no aplica a empresas)

**Lógica de cálculo:**

**Lógica de cálculo (fuente: ARCA — régimen Pequeños Envíos):**

El IVA siempre aplica sobre el valor total. Los derechos de importación y la tasa estadística están exentos hasta USD 400; si el envío supera ese monto, esos tributos se aplican sobre el **excedente**.

```
Base = valorDeclarado + costoEnvio  (valor FOB + flete)

IVA = 21% × Base                    (siempre, sobre el total)

Si Base ≤ 400:
  arancelExcedente = 0
  tasaEstadistica  = 0

Si 400 < Base ≤ 3.000:
  arancelExcedente = 50% × (Base - 400)   // arancel simplificado s/excedente
  tasaEstadistica  = 0.5% × (Base - 400)  // a confirmar si aplica en courier

Si Base > 3.000:
  No aplica régimen pequeños envíos → redirigir a calculadora formal

totalImpuestos = IVA + arancelExcedente + tasaEstadistica
costoFinal     = Base + totalImpuestos
multiplicador  = costoFinal / Base
```

**Nota sobre la tasa estadística en courier:** la normativa ARCA exime del derecho de importación y tasa estadística hasta $400. Para el excedente dice "abonar los tributos antes dispensados". En implementación confirmar si la tasa estadística (0.5%) aplica sobre el excedente o si en la práctica solo se cobra el arancel simplificado (50%).

**Ejemplos de verificación:**
| Valor (USD) | IVA | Arancel s/excedente | Total impuesto | Costo final |
|---|---|---|---|---|
| 300 | 63.00 | 0 | 63.00 | 363.00 |
| 800 | 168.00 | 200.00 | 368.00 | 1.168.00 |
| 3.000 | 630.00 | 1.300.00 | 1.930.00 | 4.930.00 |

*(Estos son los valores del artículo existente — estaban correctos)*

**Empresa vs. persona humana:** el régimen de Pequeños Envíos con franquicia de $400 está disponible también para personas jurídicas según ARCA (el doc dice "personas humanas o jurídicas"). La diferencia es que las 5 veces/año aplica "por persona" — verificar en implementación cómo aplica a empresas.

**Interfaces TypeScript:**

```typescript
interface CourierInput {
  valorDeclarado: number;  // USD (valor FOB)
  costoEnvio: number;      // USD, default 0
}

type CourierRegime = 'franquicia' | 'excedente' | 'supera_limite';

interface CourierResult {
  base: number;
  iva: number;                 // 21% sobre el total
  arancelExcedente: number;    // 50% sobre (base - 400), si base > 400
  totalImpuestos: number;
  costoFinal: number;
  multiplicador: number;
  regime: CourierRegime;
}
```

---

### 2. Componente `CourierCalculator.tsx`

Componente React que recibe `client:load`. Sigue el estilo visual del `ImportCalculator.tsx` existente.

**Inputs:**
- Valor declarado (USD) — número, requerido
- Costo de envío (USD) — número, default 0, label "si no está incluido en el precio"
- Toggle: Persona humana / Empresa
- Select: Canal de envío — "Courier privado (DHL, FedEx, UPS)" | "Correo Argentino"
  (el canal es informacional hoy; en implementación ver si afecta el cálculo con el USD 5)

**Resultados (condicionales por regime):**

- `franquicia`: badge verde "Dentro de la franquicia de USD 400"
  - Tabla: valor base / IVA 21% / costo final / multiplicador
  - Nota: "No pagás derechos de importación ni tasa estadística"

- `excedente`: badge naranja "Superás la franquicia"
  - Tabla: valor base / IVA 21% sobre total / arancel simplificado 50% s/excedente / costo final / multiplicador
  - Nota: "El excedente de USD [400] paga arancel simplificado del 50%"
  - Sugerencia condicional si el valor es cercano a $400: "Considerá dividir en [N] envíos de hasta USD 400 cada uno"

- `supera_limite`: badge rojo "Superás el límite del régimen courier (USD 3.000)"
  - No muestra tabla de cálculo
  - CTA: "Para este monto necesitás despacho formal → [link a /calculadora]"

**Widget informativo (solo persona humana):**
Bajo los resultados: "Recordá que este envío sería 1 de tus 5 anuales. Con 5 envíos similares traerías USD [N] en mercadería."

**Analytics:** disparar evento `courier_calc_complete` con `{ regime, costo_final }` al primer cálculo exitoso.

---

### 3. Página `courier.astro`

**URL:** `/calculadora/courier`

**SEO:**
- Title: `Calculadora Courier Argentina 2026 | Régimen Puerta a Puerta`
- Description: `Calculá cuánto IVA y arancel pagás por tus compras del exterior en Argentina. Franquicia de USD 400, límite de 5 envíos por año, régimen courier simplificado.`
- Schema: `WebApplication` (courier), `FAQPage` (3 Q&A), `BreadcrumbList`, `WebPage`
- OG image: reusar `calculadora-importaciones.png` (misma imagen)

**Estructura de la página:**

1. **Header** — eyebrow "Régimen courier / puerta a puerta", H1 "Calculá cuánto pagás al comprar del exterior", párrafo introductorio con keyword "compras online del exterior Argentina"

2. **Componente `<CourierCalculator client:load />`**

3. **Sección: Reglas del régimen** (estática, H2)
   - Tabla resumen: franquicia USD 400 / límite USD 3.000 / 5 envíos/año / 3 unidades misma especie / solo personas humanas
   - Link al artículo: "Guía completa del régimen courier →"

4. **Sección: Courier vs. Régimen formal** (H2, estática — conceptual, no interactiva)
   - Tabla conceptual de dos columnas mostrando qué aplica en cada régimen
   - Texto: "Para envíos comerciales o montos superiores a USD 3.000, usá la calculadora de importación formal"
   - CTA: link a `/calculadora`

5. **FAQs courier** (H2, 3-4 items visuales + schema)
   - ¿Cuánto IVA pago si compro en Shein?
   - ¿Qué pasa si supero USD 400 en un envío?
   - ¿Cuántos envíos puedo recibir del exterior por año?
   - ¿Puede una empresa usar el régimen courier con franquicia?

6. **CTA final** — "¿Importás como empresa o cantidad formal? → Calculadora de importación formal" + "Contactar un experto →"

---

### 4. Quick wins SEO en `index.astro`

**Sincronización FAQPage schema:**
Agregar al `@graph` de `index.astro` la 4ta Q&A que ya está en el HTML:
```json
{
  "@type": "Question",
  "name": "La herramienta sirve como calculadora de aduana en Argentina",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "Sí. La calculadora ayuda a simular el costo de importación antes de comprar, comparar escenarios y entender cuánto impactan aranceles, impuestos y logística en el costo final."
  }
}
```

**2 FAQs nuevos courier en landing:**
- En HTML (nueva FAQ card): "¿Cuánto IVA pago al comprar en Shein o Temu desde Argentina?" con respuesta breve + link a `/calculadora/courier`
- En HTML (nueva FAQ card): "¿Cuántos envíos del exterior puedo recibir por año en Argentina?" con respuesta + link al artículo courier
- Agregar ambos al `FAQPage` schema también

**Mejora meta `/calculadora/index.astro`:**
```
description: "Calculadora de importaciones Argentina: estimá aranceles, IVA, tasa estadística y gastos de despacho en segundos. Incluye régimen formal y courier."
```

---

## Fase 2 — `/courier-vs-formal` (próximo PR)

Página comparativa interactiva.

**Inputs únicos:**
- Valor del producto (USD)
- Flete (USD) — para el lado formal

**Layout:** dos columnas, un input compartido

| Courier (puerta a puerta) | Régimen formal |
|---|---|
| IVA 21% sobre USD XXX | Valor CIF: USD XXX |
| Arancel simplificado s/excedente | Arancel 14%: USD XXX |
| **Total impuestos: USD XXX** | IVA 21%: USD XXX |
| **Costo final: USD XXX** | Tasa estadística: USD XXX |
| **Multiplicador: X.XXx** | Gastos despacho: USD XXX |
| | **Costo final: USD XXX** |
| | **Multiplicador: X.XXx** |

Banner destacado: "Para este valor, [courier / formal] te resulta [X]% más barato."

**Implementación:** reutiliza `calculateCourierCost` (nueva) + `calculateImportCost` (existente).

---

## Verificación

**Fase 1 — cómo testear:**

1. `npm run dev` y navegar a `/calculadora/courier`
2. Ingresar USD 300 → verificar que muestra "Franquicia", IVA = $63, costo final = $363
3. Ingresar USD 800 → verificar "Excedente": IVA = $168, arancel = $200, total = $1.168
4. Ingresar USD 3.500 → verificar advertencia de límite sin tabla de cálculo
5. Toggle "Empresa" → verificar que desaparece la franquicia
6. Verificar que `/` tiene 6 Q&A en el schema JSON-LD (3 originales + 1 sync + 2 courier nuevos; revisar source HTML)
7. Verificar que `description` de `/calculadora` es el nuevo texto
8. `npm run build` sin errores TypeScript

**SEO post-deploy:**
- Inspeccionar con Google Rich Results Test en `/calculadora/courier`
- Verificar que el artículo de Shein/Temu linkea a la nueva página desde la calculadora inline CTA

---

## Decisiones de diseño

- La calculadora courier no usa las categorías de productos (8%, 14%, 35%) de la calculadora formal porque el régimen courier tiene tasas fijas simplificadas independientes del NCM.
- No se propone un contador de "envíos usados" con persistencia (localStorage) en Fase 1 para mantener el scope simple.
- La Fase 2 (`/courier-vs-formal`) espera a tener `CourierCalculator` estabilizado en producción antes de integrar la comparación.
