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
