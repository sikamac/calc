export interface ImportCalculationInput {
  valorEXW: number;
  tasaArancel: number;
  tasaAntidumping: number;
  tasaIVA: number;
  tasaIVAAdicional: number;
  tasaGanancias: number;
  tasaPercepcionIB: number;
  flete: number;
  seguro: number;
  costoTransferenciaBancaria: number;
  gastosDespachante: number;
  costoDepositoFiscal: number;
}

export interface ImportCalculation {
  valorEXW: number;
  valorCIF: number;
  arancel: number;
  derechoAntidumping: number;
  tasaEstadistica: number;
  baseIVA: number;
  iva: number;
  ivaAdicional: number;
  impuestoGanancias: number;
  percepcionIB: number;
  flete: number;
  seguro: number;
  costoTransferenciaBancaria: number;
  gastosDespachante: number;
  costoDepositoFiscal: number;
  costoFinal: number;
  costoTotalEnEXW: number;
}

export function calculateImportCost(input: ImportCalculationInput): ImportCalculation {
  const valorEXW = input.valorEXW || 0;
  const valorCIF = valorEXW + input.flete + input.seguro;
  const arancel = valorCIF * input.tasaArancel / 100;
  const derechoAntidumping = valorCIF * input.tasaAntidumping / 100;
  const tasaEstadisticaSinTope = valorEXW * 0.005;
  const topeTasaEstadistica = valorEXW <= 10_000
    ? 180
    : valorEXW <= 100_000
      ? 3_000
      : valorEXW <= 1_000_000
        ? 30_000
        : 150_000;
  const tasaEstadistica = Math.min(tasaEstadisticaSinTope, topeTasaEstadistica);
  const baseIVA = valorCIF + arancel + derechoAntidumping + tasaEstadistica;
  const iva = baseIVA * input.tasaIVA / 100;
  const ivaAdicional = baseIVA * input.tasaIVAAdicional / 100;
  const impuestoGanancias = baseIVA * input.tasaGanancias / 100;
  const percepcionIB = baseIVA * input.tasaPercepcionIB / 100;
  const costoFinal = baseIVA + iva + ivaAdicional + impuestoGanancias + percepcionIB
    + input.costoTransferenciaBancaria + input.gastosDespachante + input.costoDepositoFiscal;

  return {
    valorEXW,
    valorCIF,
    arancel,
    derechoAntidumping,
    tasaEstadistica,
    baseIVA,
    iva,
    ivaAdicional,
    impuestoGanancias,
    percepcionIB,
    flete: input.flete,
    seguro: input.seguro,
    costoTransferenciaBancaria: input.costoTransferenciaBancaria,
    gastosDespachante: input.gastosDespachante,
    costoDepositoFiscal: input.costoDepositoFiscal,
    costoFinal,
    costoTotalEnEXW: valorEXW > 0 ? costoFinal / valorEXW : 0,
  };
}
