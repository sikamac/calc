# Calculadora Courier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una calculadora del régimen courier (pequeños envíos) en `/calculadora/courier` y mejorar el SEO de la landing con FAQs adicionales.

**Architecture:** Nueva lib de cálculo pura (`courier-calculation.ts`) → componente React (`CourierCalculator.tsx`) → página Astro (`courier.astro`). Los quick wins de SEO se aplican directamente en `index.astro` y `calculadora/index.astro`. Sigue exactamente el mismo patrón que `import-calculation.ts` → `ImportCalculator.tsx` → `calculadora/index.astro`.

**Tech Stack:** Astro 5, React 19, TypeScript 5, Tailwind CSS 4. Sin framework de tests — la lógica pura se verifica con `npx tsx`. Sin `vitest` configurado.

## Global Constraints

- Dos canales con lógica distinta: **courier privado** (DHL/FedEx/UPS, Decreto 1065/2024) y **Correo Argentino / Puerta a Puerta**.
- No se aplica tasa estadística en ninguno de los dos canales.
- Paleta de colores: `#081C3A` (dark), `#0074D9` (blue), `#00246B` (darkblue), `#5D6B82` (gray), `#DDE6F2` (border), `#F8FAFC` (bg). No inventar nuevos colores.
- Clases Tailwind: seguir el patrón del proyecto (sin archivos CSS separados para el componente; styles en el `.tsx` con `className`).
- Analytics: usar el mismo patrón `pushDataLayerEvent` que existe en `ImportCalculator.tsx`.
- Schema JSON-LD: seguir la arquitectura `@graph` con `@id` references como en `BaseLayout.astro`.
- `npm run build` debe pasar sin errores TypeScript ni de Astro al final de cada tarea.

### Reglas por canal

| | Courier privado (DHL, FedEx) | Correo Argentino / P&P |
|---|---|---|
| Franquicia | USD 400 | USD 50 |
| Hasta franquicia | IVA 21% s/total | Exento (ni IVA) |
| Excedente | IVA 21% s/total + 50% s/excedente | 50% s/excedente (all-inclusive, sin IVA aparte) |
| Límite valor | USD 3.000 | USD 3.000 |
| Límite peso | 50 kg | 20 kg |
| Envíos/año | 5 | 12 (con franquicia) |

---

## File Map

| Acción | Archivo | Responsabilidad |
|---|---|---|
| Crear | `src/lib/courier-calculation.ts` | Lógica pura de cálculo courier (sin efectos) |
| Crear | `src/lib/courier-calculation.test.ts` | Tests de la función de cálculo |
| Crear | `src/components/calculator/CourierCalculator.tsx` | UI React de la calculadora |
| Crear | `src/pages/calculadora/courier.astro` | Página `/calculadora/courier` con SEO |
| Modificar | `src/pages/index.astro` | Sync FAQ schema + 2 FAQ cards courier |
| Modificar | `src/pages/calculadora/index.astro` | Mejorar `description` meta |

---

## Task 1: Lógica de cálculo courier

**Files:**
- Create: `src/lib/courier-calculation.ts`
- Create: `src/lib/courier-calculation.test.ts`

**Interfaces:**
- Produces: `calculateCourierCost(input: CourierInput): CourierResult` — usada en Task 2

- [ ] **Step 1: Crear `src/lib/courier-calculation.ts`**

```typescript
export type CourierChannel = 'privado' | 'correo_argentino';
export type CourierRegime = 'franquicia' | 'excedente' | 'supera_limite';

export interface CourierInput {
  valorDeclarado: number;
  costoEnvio: number;
  channel: CourierChannel;
}

export interface CourierResult {
  base: number;
  franquicia: number;        // USD 400 (privado) o USD 50 (correo_argentino)
  iva: number;               // 0 en correo_argentino dentro de franquicia
  arancelExcedente: number;  // 50% s/excedente en ambos canales
  totalImpuestos: number;
  costoFinal: number;
  multiplicador: number;
  regime: CourierRegime;
  channel: CourierChannel;
}

// Courier privado (DHL, FedEx, UPS) — Decreto 1065/2024
const PRIVADO_FRANQUICIA  = 400;
const PRIVADO_LIMITE      = 3000;
const TASA_IVA            = 0.21;
const TASA_ARANCEL        = 0.50;

// Correo Argentino / Puerta a Puerta
const CA_FRANQUICIA       = 50;
const CA_LIMITE           = 3000;

export function calculateCourierCost(input: CourierInput): CourierResult {
  const base = (input.valorDeclarado || 0) + (input.costoEnvio || 0);
  const limite = input.channel === 'correo_argentino' ? CA_LIMITE : PRIVADO_LIMITE;
  const franquicia = input.channel === 'correo_argentino' ? CA_FRANQUICIA : PRIVADO_FRANQUICIA;

  if (base > limite) {
    return {
      base, franquicia,
      iva: 0, arancelExcedente: 0, totalImpuestos: 0,
      costoFinal: 0, multiplicador: 0,
      regime: 'supera_limite',
      channel: input.channel,
    };
  }

  let iva = 0;
  let arancelExcedente = 0;

  if (input.channel === 'correo_argentino') {
    // Hasta $50: exento total (ni IVA)
    // Excedente sobre $50: 50% all-inclusive (sin IVA aparte)
    iva = 0;
    arancelExcedente = base > CA_FRANQUICIA
      ? (base - CA_FRANQUICIA) * TASA_ARANCEL
      : 0;
  } else {
    // Courier privado
    // IVA siempre sobre el total; 50% solo sobre excedente de $400
    iva = base * TASA_IVA;
    arancelExcedente = base > PRIVADO_FRANQUICIA
      ? (base - PRIVADO_FRANQUICIA) * TASA_ARANCEL
      : 0;
  }

  const totalImpuestos = iva + arancelExcedente;
  const costoFinal = base + totalImpuestos;

  return {
    base, franquicia,
    iva, arancelExcedente, totalImpuestos, costoFinal,
    multiplicador: base > 0 ? costoFinal / base : 0,
    regime: base <= franquicia ? 'franquicia' : 'excedente',
    channel: input.channel,
  };
}
```

- [ ] **Step 2: Crear `src/lib/courier-calculation.test.ts`**

```typescript
import assert from 'node:assert/strict';
import { calculateCourierCost } from './courier-calculation.ts';

// ===== COURIER PRIVADO (DHL, FedEx) =====

// Franquicia: base ≤ 400
const r300 = calculateCourierCost({ valorDeclarado: 300, costoEnvio: 0, channel: 'privado' });
assert.equal(r300.regime, 'franquicia');
assert.equal(r300.base, 300);
assert.equal(r300.iva, 63);               // 300 × 0.21
assert.equal(r300.arancelExcedente, 0);
assert.equal(r300.costoFinal, 363);
assert.ok(Math.abs(r300.multiplicador - 1.21) < 0.001);

const r400 = calculateCourierCost({ valorDeclarado: 400, costoEnvio: 0, channel: 'privado' });
assert.equal(r400.regime, 'franquicia');
assert.equal(r400.iva, 84);
assert.equal(r400.arancelExcedente, 0);
assert.equal(r400.costoFinal, 484);

// Excedente: 400 < base ≤ 3000
const r800 = calculateCourierCost({ valorDeclarado: 800, costoEnvio: 0, channel: 'privado' });
assert.equal(r800.regime, 'excedente');
assert.equal(r800.iva, 168);              // 800 × 0.21
assert.equal(r800.arancelExcedente, 200); // (800-400) × 0.50
assert.equal(r800.totalImpuestos, 368);
assert.equal(r800.costoFinal, 1168);

// Con costo de envío incluido en la base
const rConEnvio = calculateCourierCost({ valorDeclarado: 450, costoEnvio: 60, channel: 'privado' });
assert.equal(rConEnvio.base, 510);
assert.equal(rConEnvio.regime, 'excedente');
assert.equal(rConEnvio.iva, 107.1);       // 510 × 0.21
assert.equal(rConEnvio.arancelExcedente, 55); // (510-400) × 0.50

// Supera límite
const r3500p = calculateCourierCost({ valorDeclarado: 3500, costoEnvio: 0, channel: 'privado' });
assert.equal(r3500p.regime, 'supera_limite');
assert.equal(r3500p.costoFinal, 0);

// ===== CORREO ARGENTINO / PUERTA A PUERTA =====

// Franquicia: base ≤ 50 → exento total, ni IVA
const rCA30 = calculateCourierCost({ valorDeclarado: 30, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA30.regime, 'franquicia');
assert.equal(rCA30.iva, 0);
assert.equal(rCA30.arancelExcedente, 0);
assert.equal(rCA30.costoFinal, 30);
assert.ok(Math.abs(rCA30.multiplicador - 1.0) < 0.001);

const rCA50 = calculateCourierCost({ valorDeclarado: 50, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA50.regime, 'franquicia');
assert.equal(rCA50.iva, 0);
assert.equal(rCA50.costoFinal, 50);

// Excedente sobre $50: 50% all-inclusive (sin IVA)
const rCA300 = calculateCourierCost({ valorDeclarado: 300, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA300.regime, 'excedente');
assert.equal(rCA300.iva, 0);
assert.equal(rCA300.arancelExcedente, 125); // (300-50) × 0.50
assert.equal(rCA300.costoFinal, 425);

const rCA800 = calculateCourierCost({ valorDeclarado: 800, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA800.arancelExcedente, 375); // (800-50) × 0.50
assert.equal(rCA800.costoFinal, 1175);

// Supera límite
const rCA3500 = calculateCourierCost({ valorDeclarado: 3500, costoEnvio: 0, channel: 'correo_argentino' });
assert.equal(rCA3500.regime, 'supera_limite');
assert.equal(rCA3500.costoFinal, 0);

// ===== EDGE CASES =====
const r0 = calculateCourierCost({ valorDeclarado: 0, costoEnvio: 0, channel: 'privado' });
assert.equal(r0.regime, 'franquicia');
assert.equal(r0.costoFinal, 0);
assert.equal(r0.multiplicador, 0);

console.log('✓ Todos los tests de courier-calculation pasaron');
```

- [ ] **Step 3: Correr los tests**

```bash
npx tsx src/lib/courier-calculation.test.ts
```

Salida esperada:
```
✓ Todos los tests de courier-calculation pasaron
```

Si falla, corregir `courier-calculation.ts` hasta que todos pasen.

- [ ] **Step 4: Commit**

```bash
git add src/lib/courier-calculation.ts src/lib/courier-calculation.test.ts
git commit -m "feat: add courier cost calculation logic with tests"
```

---

## Task 2: Componente React CourierCalculator

**Files:**
- Create: `src/components/calculator/CourierCalculator.tsx`

**Interfaces:**
- Consumes: `calculateCourierCost({ valorDeclarado, costoEnvio })` de `../../lib/courier-calculation`
- Produces: `export const CourierCalculator: React.FC` — importada en Task 3

- [ ] **Step 1: Crear `src/components/calculator/CourierCalculator.tsx`**

```tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateCourierCost, type CourierResult, type CourierChannel } from '../../lib/courier-calculation';

const pushDataLayerEvent = (event: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...parameters });
};

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export const CourierCalculator: React.FC = () => {
  const [valorDeclarado, setValorDeclarado] = useState<string>('300');
  const [costoEnvio, setCostoEnvio] = useState<string>('0');
  const [channel, setChannel] = useState<CourierChannel>('privado');
  const hasCompletedRef = useRef(false);

  const result = useMemo<CourierResult | null>(() => {
    const v = parseFloat(valorDeclarado.replace(',', '.'));
    if (!valorDeclarado || isNaN(v) || v < 0) return null;
    const e = parseFloat(costoEnvio.replace(',', '.')) || 0;
    return calculateCourierCost({ valorDeclarado: v, costoEnvio: e, channel });
  }, [valorDeclarado, costoEnvio, channel]);

  useEffect(() => {
    if (result && result.regime !== 'supera_limite' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      pushDataLayerEvent('courier_calc_complete', {
        regime: result.regime,
        costo_final: result.costoFinal,
      });
    }
  }, [result]);

  return (
    <div className="bg-white rounded-2xl border border-[#DDE6F2] shadow-sm overflow-hidden">
      {/* Selector de canal */}
      <div className="p-6 md:p-8 pb-0">
        <div className="flex gap-2 mb-6">
          {([
            { value: 'privado', label: 'Courier privado (DHL, FedEx, UPS)' },
            { value: 'correo_argentino', label: 'Correo Argentino / Puerta a puerta' },
          ] as { value: CourierChannel; label: string }[]).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setChannel(value)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-colors text-center ${
                channel === value
                  ? 'bg-[#00246B] text-white border-[#00246B]'
                  : 'bg-white text-[#5D6B82] border-[#DDE6F2] hover:border-[#00246B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Nota informativa del canal */}
        <p className="text-xs text-[#5D6B82] mb-6 bg-[#F8FAFC] rounded-lg px-4 py-2.5">
          {channel === 'privado'
            ? 'Franquicia USD 400 · 5 envíos/año · hasta 50 kg · Decreto 1065/2024'
            : 'Franquicia USD 50 · 12 envíos/año con franquicia · hasta 20 kg · Correo Oficial'}
        </p>
      </div>

      {/* Inputs */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 border-b border-[#DDE6F2]">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="valorDeclarado"
              className="block text-sm font-semibold text-[#081C3A] mb-2"
            >
              Valor del producto (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D6B82] font-medium text-sm">
                USD
              </span>
              <input
                id="valorDeclarado"
                type="number"
                min="0"
                step="any"
                value={valorDeclarado}
                onChange={(e) => setValorDeclarado(e.target.value)}
                placeholder="300"
                className="w-full pl-12 pr-4 py-3 border border-[#DDE6F2] rounded-lg text-[#081C3A] font-medium focus:outline-none focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-sm"
              />
            </div>
            <p className="text-xs text-[#5D6B82] mt-1.5">
              Valor FOB declarado ante la aduana
            </p>
          </div>
          <div>
            <label
              htmlFor="costoEnvio"
              className="block text-sm font-semibold text-[#081C3A] mb-2"
            >
              Costo de envío (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5D6B82] font-medium text-sm">
                USD
              </span>
              <input
                id="costoEnvio"
                type="number"
                min="0"
                step="any"
                value={costoEnvio}
                onChange={(e) => setCostoEnvio(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 border border-[#DDE6F2] rounded-lg text-[#081C3A] font-medium focus:outline-none focus:ring-2 focus:ring-[#0074D9] focus:border-transparent text-sm"
              />
            </div>
            <p className="text-xs text-[#5D6B82] mt-1.5">
              Dejá en 0 si el envío ya está incluido en el precio
            </p>
          </div>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className="p-6 md:p-8">
          {result.regime === 'supera_limite' && (
            <SuperaLimiteCard base={result.base} channel={result.channel} />
          )}
          {(result.regime === 'franquicia' || result.regime === 'excedente') && (
            <ResultCard result={result} />
          )}
        </div>
      )}
    </div>
  );
};

function ResultCard({ result }: { result: CourierResult }) {
  const esFranquicia = result.regime === 'franquicia';

  return (
    <div>
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 ${
          esFranquicia
            ? 'bg-[#dcfce7] text-[#15803d]'
            : 'bg-[#fff7ed] text-[#c2410c]'
        }`}
      >
        <span>{esFranquicia ? '✓' : '⚠'}</span>
        <span>
          {esFranquicia
            ? 'Dentro de la franquicia de USD 400'
            : 'Superás la franquicia de USD 400'}
        </span>
      </div>

      {/* Desglose */}
      <div className="space-y-0">
        <Row label="Valor base (producto + envío)" value={`USD ${fmt(result.base)}`} />
        {result.channel === 'privado' && (
          <Row label="IVA 21% sobre el total" value={`USD ${fmt(result.iva)}`} highlight />
        )}
        {!esFranquicia && (
          <Row
            label={`Arancel simplificado 50% s/excedente de USD ${result.franquicia}`}
            value={`USD ${fmt(result.arancelExcedente)}`}
            highlight
          />
        )}
        <div className="border-t border-[#DDE6F2] mt-2 pt-4 flex justify-between items-baseline">
          <span className="text-sm font-semibold text-[#081C3A]">
            Total impuestos
          </span>
          <span className="font-bold text-[#081C3A]">
            USD {fmt(result.totalImpuestos)}
          </span>
        </div>
      </div>

      {/* Costo final */}
      <div className="mt-4 bg-[#EAF1F4] rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#5D6B82] uppercase tracking-wide mb-0.5">
            Costo final estimado
          </p>
          <p className="text-2xl font-bold text-[#081C3A]">
            USD {fmt(result.costoFinal)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#5D6B82] uppercase tracking-wide mb-0.5">
            Multiplicador
          </p>
          <p className="text-2xl font-bold text-[#246b8c]">
            {result.multiplicador.toFixed(2)}x
          </p>
        </div>
      </div>

      {/* Nota franquicia */}
      {esFranquicia && result.channel === 'privado' && (
        <p className="mt-4 text-xs text-[#5D6B82] bg-[#F8FAFC] rounded-lg px-4 py-3">
          Sin derechos de importación ni tasa estadística — solo IVA 21% sobre el total.
        </p>
      )}
      {esFranquicia && result.channel === 'correo_argentino' && (
        <p className="mt-4 text-xs text-[#5D6B82] bg-[#F8FAFC] rounded-lg px-4 py-3">
          Dentro de la franquicia de USD 50 — este envío no paga ningún impuesto.
        </p>
      )}

      {/* Tip excedente courier privado */}
      {!esFranquicia && result.channel === 'privado' && result.base <= 800 && (
        <p className="mt-4 text-xs text-[#c2410c] bg-[#fff7ed] rounded-lg px-4 py-3">
          💡 Si dividís la compra en dos envíos de hasta USD 400 cada uno,
          pagarías solo IVA 21% en cada envío (sin el 50% de arancel).
        </p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-[#F1F5F9]">
      <span className="text-sm text-[#5D6B82] pr-4">{label}</span>
      <span
        className={`text-sm font-semibold whitespace-nowrap ${
          highlight ? 'text-[#c2410c]' : 'text-[#081C3A]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function SuperaLimiteCard({ base, channel }: { base: number; channel: CourierChannel }) {
  const pesoMax = channel === 'correo_argentino' ? '20 kg' : '50 kg';
  return (
    <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-6 text-center">
      <p className="text-[#dc2626] font-bold text-lg mb-2">
        ✗ Superás el límite del régimen courier (USD 3.000)
      </p>
      <p className="text-[#5D6B82] text-sm mb-4">
        Un envío de USD {new Intl.NumberFormat('es-AR').format(base)} no puede
        ingresar como pequeño envío (límite: USD 3.000 / {pesoMax}).
        Necesitás un despacho formal con despachante de aduanas.
      </p>
      <a
        href="/calculadora"
        className="inline-block px-5 py-2.5 bg-[#00246B] text-white text-sm font-semibold rounded-lg hover:bg-[#081C3A] transition-colors"
      >
        Ir a la calculadora formal →
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Verificar en dev server**

```bash
npm run dev
```

Navegar a `http://localhost:4321/calculadora/courier` (la página aún no existe — vas a ver un 404, lo cual es correcto por ahora). Para verificar el componente en este paso, agregar temporalmente `<CourierCalculator client:load />` a cualquier página existente, por ejemplo `calculadora/index.astro`, y confirmar que renderiza.

Si hay errores TypeScript en la consola de Astro, corregirlos antes de continuar.

- [ ] **Step 3: Commit**

```bash
git add src/components/calculator/CourierCalculator.tsx
git commit -m "feat: add CourierCalculator React component"
```

---

## Task 3: Página `/calculadora/courier`

**Files:**
- Create: `src/pages/calculadora/courier.astro`

**Interfaces:**
- Consumes: `CourierCalculator` de `../../components/calculator/CourierCalculator`
- Consumes: `BaseLayout`, `Header`, `Footer` (patrón idéntico a `calculadora/index.astro`)

- [ ] **Step 1: Crear `src/pages/calculadora/courier.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import { CourierCalculator } from '../../components/calculator/CourierCalculator';

const title = "Calculadora Courier Argentina 2026 | Régimen Puerta a Puerta";
const description = "Calculá cuánto IVA y arancel pagás por tus compras del exterior en Argentina. Franquicia de USD 400, régimen de pequeños envíos (puerta a puerta).";
const siteUrl = (Astro.site?.href || 'https://calculadoraimportacion.com.ar').replace(/\/$/, '');

const faqItems = [
  {
    q: "¿Cuánto IVA pago si compro en Shein, Temu o Amazon desde Argentina?",
    a: "Si el valor del envío no supera USD 400, pagás IVA del 21% sobre el valor total del producto más envío. No se aplican derechos de importación ni tasa estadística dentro de la franquicia. Por ejemplo, una compra de USD 300 te costaría USD 63 de IVA, con un costo final de USD 363.",
  },
  {
    q: "¿Qué pasa si mi compra supera los USD 400?",
    a: "Si el valor del envío supera la franquicia de USD 400, pagás IVA del 21% sobre el total más un arancel simplificado del 50% sobre el excedente de USD 400. Por ejemplo, una compra de USD 800 paga IVA de USD 168 más arancel de USD 200, con un costo final de USD 1.168.",
  },
  {
    q: "¿Cuántos envíos del exterior puedo recibir por año en Argentina?",
    a: "El régimen de pequeños envíos permite hasta 5 envíos por año calendario y por persona. Cada envío puede tener hasta USD 3.000 de valor y 50 kg de peso. Además, no podés incluir más de 3 unidades de la misma especie por paquete.",
  },
  {
    q: "¿Puedo usar este régimen si soy empresa?",
    a: "Sí, las personas jurídicas también pueden operar por courier como Pequeño Envío, pero el límite de 5 envíos anuales aplica 'por persona'. Las empresas que importan regularmente suelen derivarse al régimen de courier comercial sin la franquicia de USD 400.",
  },
];

const schema = [
  {
    "@type": "BreadcrumbList",
    "@id": `${Astro.url.href}#breadcrumb`,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Calculadora", "item": `${siteUrl}/calculadora` },
      { "@type": "ListItem", "position": 3, "name": "Courier / Puerta a puerta", "item": Astro.url.href },
    ],
  },
  {
    "@type": "WebApplication",
    "@id": `${Astro.url.href}#webapp-courier`,
    "name": "Calculadora Courier Argentina — Régimen Pequeños Envíos",
    "description": description,
    "url": Astro.url.href,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": "es-AR",
    "isAccessibleForFree": true,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "publisher": { "@id": `${siteUrl}#organization` },
  },
  {
    "@type": "FAQPage",
    "@id": `${Astro.url.href}#faq`,
    "mainEntity": faqItems.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  },
];
---

<BaseLayout
  title={title}
  description={description}
  url={Astro.url.href}
  schema={schema}
>
  <Header />
  <main>

    <!-- Header -->
    <section style="background: linear-gradient(115deg, #F7FAFB 0%, #EEF7F7 46%, #F8FAFC 100%); padding: 48px 0 56px; border-bottom: 1px solid #DDE6F2;">
      <div style="width: min(100% - 48px, 860px); margin: 0 auto; text-align: center;">
        <p style="color: #3084ae; font-size: 13px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;">
          Régimen de pequeños envíos · Puerta a puerta
        </p>
        <h1 style="color: #081C3A; font-size: clamp(32px, 5vw, 52px); line-height: 1.08; font-weight: 700; margin: 0 0 20px;">
          Calculá cuánto pagás al comprar del exterior en Argentina
        </h1>
        <p style="color: #5D6B82; font-size: 18px; line-height: 1.7; max-width: 640px; margin: 0 auto;">
          IVA, franquicia de USD 400 y arancel simplificado del régimen courier. Resultado al instante, sin registro.
        </p>
      </div>
    </section>

    <!-- Calculadora -->
    <section style="padding: 56px 0; background: #F8FAFC;">
      <div style="width: min(100% - 48px, 680px); margin: 0 auto;">
        <CourierCalculator client:load />
        <p style="text-align: center; font-size: 12px; color: #5D6B82; margin-top: 16px;">
          Estimación basada en el régimen de Pequeños Envíos (ARCA). Consulte con un despachante para operaciones específicas.
        </p>
      </div>
    </section>

    <!-- Reglas del régimen -->
    <section style="padding: 64px 0; background: #fff;">
      <div style="width: min(100% - 48px, 1100px); margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="color: #081C3A; font-size: 28px; font-weight: 700; margin: 0 0 12px;">
            Reglas del régimen de pequeños envíos
          </h2>
          <p style="color: #5D6B82; font-size: 16px; max-width: 580px; margin: 0 auto;">
            El régimen courier tiene límites claros que conviene revisar antes de comprar.
          </p>
        </div>
        <div class="rules-grid">
          {[
            { title: 'Franquicia USD 400', desc: 'Hasta USD 400 por envío: solo pagás IVA 21%. Sin derechos de importación ni tasa estadística.' },
            { title: 'Límite USD 3.000', desc: 'El valor máximo por envío es USD 3.000 y 50 kg. Si superás ese monto, necesitás despacho formal.' },
            { title: '5 envíos por año', desc: 'Podés utilizar este régimen hasta 5 veces por año calendario y por persona (CUIT o CUIL).' },
            { title: 'Máx. 3 unidades iguales', desc: 'No podés incluir más de 3 unidades de la misma especie en un envío bajo este régimen.' },
          ].map(({ title, desc }) => (
            <div class="rule-card">
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <p style="text-align: center; margin-top: 28px;">
          <a href="/blog/comprar-shein-temu-argentina-regimen-courier" style="color: #0074D9; font-weight: 600; font-size: 14px; text-decoration: none;">
            Leer la guía completa del régimen courier →
          </a>
        </p>
      </div>
    </section>

    <!-- Courier vs. Formal (estático) -->
    <section style="padding: 64px 0; background: #F8FAFC;">
      <div style="width: min(100% - 48px, 1100px); margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="color: #081C3A; font-size: 28px; font-weight: 700; margin: 0 0 12px;">
            Courier vs. Régimen formal: ¿cuándo conviene cada uno?
          </h2>
          <p style="color: #5D6B82; font-size: 16px; max-width: 580px; margin: 0 auto;">
            El régimen courier simplifica el trámite pero tiene límites. El formal es obligatorio para montos mayores o importaciones comerciales.
          </p>
        </div>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Aspecto</th>
                <th class="col-courier">Courier (pequeños envíos)</th>
                <th class="col-formal">Régimen formal</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Valor máximo</td><td>USD 3.000 por envío</td><td>Sin límite</td></tr>
              <tr><td>IVA</td><td>21% sobre el total</td><td>21% sobre base imponible</td></tr>
              <tr><td>Derechos de importación</td><td>Exentos hasta USD 400 / 50% s/excedente</td><td>Según NCM (generalmente 8%–35%)</td></tr>
              <tr><td>Tasa estadística</td><td>No aplica</td><td>0.5% con tope</td></tr>
              <tr><td>Despachante de aduanas</td><td>No requerido</td><td>Obligatorio</td></tr>
              <tr><td>Entrega</td><td>A domicilio por el courier</td><td>Retiro en zona primaria</td></tr>
              <tr><td>Límite anual</td><td>5 envíos por persona</td><td>Sin límite</td></tr>
              <tr><td>Uso comercial</td><td>No permitido</td><td>Permitido</td></tr>
            </tbody>
          </table>
        </div>
        <div style="text-align: center; margin-top: 28px;">
          <a href="/calculadora" style="display: inline-block; padding: 12px 24px; background: #00246B; color: #fff; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none;">
            Ir a la calculadora de régimen formal →
          </a>
        </div>
      </div>
    </section>

    <!-- FAQs -->
    <section style="padding: 64px 0; background: #fff;">
      <div style="width: min(100% - 48px, 860px); margin: 0 auto;">
        <h2 style="color: #081C3A; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 40px;">
          Preguntas frecuentes sobre el régimen courier
        </h2>
        <div class="faq-list">
          {faqItems.map(({ q, a }) => (
            <div class="faq-item">
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section style="padding: 48px 0; background: #F8FAFC;">
      <div style="width: min(100% - 48px, 1100px); margin: 0 auto;">
        <div class="cta-card">
          <div>
            <h2>¿Importás como empresa o en grandes cantidades?</h2>
            <p>La calculadora formal te permite estimar aranceles según NCM, IVA, tasa estadística y gastos de despacho para operaciones comerciales.</p>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="/calculadora" class="btn-cta-primary">Calculadora formal →</a>
            <a href="/contacto" class="btn-cta-secondary">Hablar con un experto</a>
          </div>
        </div>
      </div>
    </section>

  </main>
  <Footer />
</BaseLayout>

<style>
  .rules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 900px) { .rules-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .rules-grid { grid-template-columns: 1fr; } }

  .rule-card {
    background: #F8FAFC;
    border: 1px solid #DDE6F2;
    border-radius: 12px;
    padding: 20px;
  }
  .rule-card h3 { font-size: 14px; font-weight: 700; color: #00246B; margin: 0 0 8px; }
  .rule-card p  { font-size: 13px; color: #5D6B82; margin: 0; line-height: 1.55; }

  .compare-table-wrap { overflow-x: auto; }
  .compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .compare-table th, .compare-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #DDE6F2;
  }
  .compare-table thead th {
    background: #F8FAFC;
    font-weight: 700;
    color: #081C3A;
    font-size: 13px;
  }
  .compare-table td:first-child { color: #5D6B82; font-weight: 500; }
  .compare-table td:not(:first-child) { color: #081C3A; }
  .col-courier { color: #15803d !important; }
  .col-formal  { color: #1d4ed8 !important; }
  .compare-table tbody tr:hover { background: #F8FAFC; }

  .faq-list { display: flex; flex-direction: column; gap: 0; }
  .faq-item {
    border-bottom: 1px solid #DDE6F2;
    padding: 24px 0;
  }
  .faq-item:last-child { border-bottom: none; }
  .faq-item h3 { font-size: 16px; font-weight: 700; color: #081C3A; margin: 0 0 10px; }
  .faq-item p  { font-size: 14px; color: #5D6B82; margin: 0; line-height: 1.65; }

  .cta-card {
    background: linear-gradient(135deg, #001B4D 0%, #00246B 55%, #003C8F 100%);
    border-radius: 18px;
    padding: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  @media (max-width: 768px) { .cta-card { flex-direction: column; align-items: flex-start; } }
  .cta-card h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 10px; line-height: 1.25; }
  .cta-card p  { color: rgba(255,255,255,0.75); margin: 0; font-size: 15px; max-width: 460px; }

  .btn-cta-primary {
    display: inline-block;
    padding: 12px 22px;
    background: #0074D9;
    color: #fff;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .btn-cta-primary:hover { background: #005faf; }

  .btn-cta-secondary {
    display: inline-block;
    padding: 12px 22px;
    background: rgba(255,255,255,0.12);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .btn-cta-secondary:hover { background: rgba(255,255,255,0.2); }
</style>
```

- [ ] **Step 2: Verificar en dev server**

```bash
npm run dev
```

Navegar a `http://localhost:4321/calculadora/courier` y verificar:
- La página carga sin errores en consola
- El componente `CourierCalculator` aparece y calcula (con el valor default USD 300 → resultado USD 363)
- La sección de reglas y la tabla de comparación se muestran correctamente
- En mobile (360px), el layout es una columna y la tabla tiene scroll horizontal

Verificar el schema JSON-LD en el `<head>` de la página:
- Clic derecho → Ver código fuente
- Buscar `application/ld+json`
- Confirmar que aparecen `WebApplication`, `FAQPage` y `BreadcrumbList`

- [ ] **Step 3: Verificar build**

```bash
npm run build 2>&1 | tail -20
```

Salida esperada: sin errores TypeScript ni de Astro. Warnings menores de CSS son aceptables.

- [ ] **Step 4: Commit**

```bash
git add src/pages/calculadora/courier.astro
git commit -m "feat: add /calculadora/courier page with SEO and schema"
```

---

## Task 4: Quick wins SEO — landing y calculadora formal

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/calculadora/index.astro`

**Interfaces:**
- Ninguna — cambios de contenido y schema únicamente

- [ ] **Step 1: Sincronizar FAQ schema en `index.astro`**

En `src/pages/index.astro`, localizar el objeto `FAQPage` dentro de `schema`. Actualmente tiene 3 Q&A. Agregar una cuarta pregunta **y** dos preguntas sobre courier.

Reemplazar el array `mainEntity` del `FAQPage` existente con:

```javascript
"mainEntity": [
  {
    "@type": "Question",
    "name": "Como calcular los gastos aduaneros en Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Para estimar gastos aduaneros conviene partir del valor EXW o FOB, sumar flete y seguro para obtener el valor CIF, y luego calcular arancel, antidumping si aplica, tasa estadistica, IVA, IVA adicional, percepciones de Ganancias, Ingresos Brutos y gastos operativos."
    }
  },
  {
    "@type": "Question",
    "name": "La calculadora sirve como simulador de costos de importacion Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Si. La herramienta funciona como simulador para ordenar los principales componentes del costo de importacion antes de comprar o definir un precio de venta."
    }
  },
  {
    "@type": "Question",
    "name": "Se pueden pagar derechos aduaneros en cuotas en Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No. Los tributos y gastos aduaneros no se pagan en cuotas para liberar mercaderia. En courier se pagan por adelantado o antes de la entrega; en despacho formal puede existir pago a vista operativo, pero la mercaderia no se libera sin cancelar la liquidacion correspondiente."
    }
  },
  {
    "@type": "Question",
    "name": "La herramienta sirve como calculadora de aduana en Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Si. La calculadora ayuda a simular el costo de importacion antes de comprar, comparar escenarios y entender cuanto impactan aranceles, impuestos y logistica en el costo final."
    }
  },
  {
    "@type": "Question",
    "name": "Cuanto IVA se paga al comprar en Shein o Temu desde Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Si el envio no supera USD 400, solo se paga IVA del 21% sobre el valor total del envio. Por ejemplo, una compra de USD 300 genera un IVA de USD 63, con costo final de USD 363. Si el envio supera USD 400, ademas del IVA se aplica un arancel simplificado del 50% sobre el excedente."
    }
  },
  {
    "@type": "Question",
    "name": "Cuantos envios del exterior puedo recibir por año en Argentina",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "El regimen de pequenos envios (courier) permite hasta 5 envios por año calendario por persona. Cada envio puede tener hasta USD 3.000 de valor y 50 kg de peso, con un maximo de 3 unidades de la misma especie por paquete."
    }
  }
]
```

- [ ] **Step 2: Agregar 2 FAQ cards courier al HTML de `index.astro`**

Localizar la sección `<!-- Sección 5: Consultas frecuentes SEO -->` en `index.astro`. El `div.faq-grid` tiene 4 `<article class="faq-card">`. Agregar dos más al final del grid:

```astro
<article class="faq-card">
  <h3>¿Cuánto IVA pago al comprar en Shein o Temu desde Argentina?</h3>
  <p>Si el envío no supera USD 400, solo pagás IVA 21% sobre el valor total. Una compra de USD 300 genera USD 63 de IVA, con costo final de USD 363. Si superás la franquicia, se suma un arancel simplificado del 50% sobre el excedente.</p>
  <a href="/calculadora/courier">Calcular costo courier →</a>
</article>
<article class="faq-card">
  <h3>¿Cuántos envíos del exterior puedo recibir por año en Argentina?</h3>
  <p>El régimen de pequeños envíos permite hasta 5 envíos por año por persona. Cada envío puede tener hasta USD 3.000 y 50 kg, con un máximo de 3 unidades iguales por paquete.</p>
  <a href="/blog/regla-3-unidades-misma-especie-courier">Ver la regla de 3 unidades →</a>
</article>
```

El grid ahora tiene 6 FAQ cards. El CSS actual es `repeat(4, 1fr)` — cambiar a `repeat(3, 1fr)` en desktop para que las 6 cards queden en 2 filas de 3:

Localizar en el `<style>` de `index.astro`:
```css
.faq-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
```
Cambiar a:
```css
.faq-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
```

- [ ] **Step 3: Actualizar `description` en `/calculadora/index.astro`**

En `src/pages/calculadora/index.astro`, localizar la línea:
```javascript
const description = "Calculá todos los costos asociados a tu importación: derechos de aduana, IVA, tasa estadística y gastos de gestión.";
```

Reemplazar con:
```javascript
const description = "Calculadora de importaciones Argentina: estimá aranceles, IVA, tasa estadística y gastos de despacho en segundos. Modo formal con parámetros configurables.";
```

- [ ] **Step 4: Verificar en dev server**

```bash
npm run dev
```

1. Navegar a `http://localhost:4321/` → ver código fuente → buscar `FAQPage` → confirmar 6 preguntas en el schema
2. Verificar que la sección FAQ visual muestra 6 cards en el layout correcto (2 filas de 3 en desktop)
3. Confirmar que los links de las 2 nuevas cards funcionan (`/calculadora/courier` y `/blog/regla-3-unidades-misma-especie-courier`)
4. Navegar a `http://localhost:4321/calculadora` → ver código fuente → confirmar nueva `description`

- [ ] **Step 5: Build final completo**

```bash
npm run build 2>&1 | tail -30
```

Salida esperada: sin errores. El sitio debería construirse correctamente con las 3 páginas nuevas/modificadas.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/calculadora/index.astro
git commit -m "seo: sync FAQ schema, add courier FAQs, improve calculadora description"
```

---

## Self-Review

**Spec coverage:**
- ✅ `courier-calculation.ts` — dos canales (privado / correo_argentino), sin tasa estadística
- ✅ Tests para ambos canales y los 3 regímenes (franquicia, excedente, supera_limite)
- ✅ `CourierCalculator.tsx` — toggle de canal funcional conectado al cálculo, IVA condicional por canal, tips, analytics
- ✅ `/calculadora/courier` — SEO title/description/schema, 6 secciones (header, calc, reglas, comparación, FAQs, CTA)
- ✅ FAQ schema sync (4ta Q&A faltante + 2 courier) → 6 total en landing
- ✅ 2 FAQ cards courier en HTML de la landing
- ✅ Mejora `description` de `/calculadora`
- ✅ Artículo `comprar-shein-temu` **no** se toca

**Placeholder scan:** ningún TBD ni TODO en el plan — todo el código está completo.

**Type consistency:**
- `CourierInput` definida en Task 1, importada en Task 2 como `import { calculateCourierCost, type CourierResult }`
- `CourierResult.regime` usa los strings `'franquicia'`, `'excedente'`, `'supera_limite'` — consistente en ambos archivos
- `CourierCalculator` exportada como named export en Task 2, importada en Task 3 como `import { CourierCalculator }`
