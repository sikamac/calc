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
          Si dividís la compra en dos envíos de hasta USD 400 cada uno,
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
