import React, { useState, useEffect } from 'react';

interface ImportCalculation {
  valorFOB: number;
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
  costoFinal: number;
  costoTotalEnFOB: number;
}

interface VentaCalculation {
  costoUnitario: number;
  valorFOB: number;
  impuestosImportacion: number;
  gastosOperativosImportacion: number;
  flete: number;
  seguro: number;
  transferenciaBancaria: number;
  gastosDespachante: number;
  costoTotalDeducible: number;
  margenGanancia: number;
  precioVenta: number;
  precioVentaEnFOB: number;
  precioVentaConIVA: number;
  baseImponibleGanancias: number;
  gananciaImponible: number;
  iibbComercio: number;
  iibbIndustria: number;
  impuestoGananciasVenta: number;
  comisionVenta: number;
  gastosFijos: number;
  honorariosSocios: number;
  honorariosDeducibles: number;
  totalRecibido: number;
  gananciaNeta: number;
  margenNeto: number;
}

type TabType = 'importacion' | 'venta';

export const ImportCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('importacion');
  
  const [valorFOB, setValorFOB] = useState<number>(1000);
  const [tasaArancel, setTasaArancel] = useState<number>(35);
  const [tasaAntidumping, setTasaAntidumping] = useState<number>(0);
  const [tasaIVA, setTasaIVA] = useState<number>(21);
  const [tipoIVAAdicional, setTipoIVAAdicional] = useState<'10' | '20'>('10');
  const [tasaGanancias, setTasaGanancias] = useState<number>(6);
  const [tasaPercepcionIB, setTasaPercepcionIB] = useState<number>(3);
  const [flete, setFlete] = useState<number>(0);
  const [seguro, setSeguro] = useState<number>(0);
  const [costoTransferenciaBancaria, setCostoTransferenciaBancaria] = useState<number>(0);
  const [gastosDespachante, setGastosDespachante] = useState<number>(0);
  const [calculo, setCalculo] = useState<ImportCalculation | null>(null);
  
  const [margenNetoDeseado, setMargenNetoDeseado] = useState<number>(20);
  const [comisionVenta, setComisionVenta] = useState<number>(0);
  const [gastosFijos, setGastosFijos] = useState<number>(0);
  const [porcentajeHonorariosSocios, setPorcentajeHonorariosSocios] = useState<number>(25);
  const [calculoVenta, setCalculoVenta] = useState<VentaCalculation | null>(null);

  useEffect(() => {
    calcularImportacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorFOB, tasaArancel, tasaAntidumping, tasaIVA, tipoIVAAdicional,
      tasaGanancias, tasaPercepcionIB, flete, seguro, costoTransferenciaBancaria, gastosDespachante]);

  useEffect(() => {
    if (calculo) {
      calcularVenta();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculo, margenNetoDeseado, comisionVenta, gastosFijos, porcentajeHonorariosSocios]);

  const calcularImportacion = () => {
    const valorFOBNumerico = valorFOB || 0;

    const valorCIF = valorFOBNumerico + flete + seguro;

    const arancelCalculado = (valorCIF * tasaArancel) / 100;

    const derechoAntidumpingCalculado = (valorCIF * tasaAntidumping) / 100;

    // Tasa Estadística con topes máximos según normativa
    let tasaEstadisticaCalculada = valorFOBNumerico * 0.005;
    let maximoTasaEstadistica = 0;

    if (valorFOBNumerico <= 10000) {
      maximoTasaEstadistica = 180;
    } else if (valorFOBNumerico <= 100000) {
      maximoTasaEstadistica = 3000;
    } else if (valorFOBNumerico <= 1000000) {
      maximoTasaEstadistica = 30000;
    } else {
      maximoTasaEstadistica = 150000;
    }

    tasaEstadisticaCalculada = Math.min(tasaEstadisticaCalculada, maximoTasaEstadistica);

    const baseDerechos = valorCIF + arancelCalculado + derechoAntidumpingCalculado + tasaEstadisticaCalculada;

    const ivaCalculado = (baseDerechos * tasaIVA) / 100;

    // IVA Adicional: 10% o 20% sobre la base imponible
    const ivaAdicionalCalculado = (baseDerechos * parseFloat(tipoIVAAdicional)) / 100;

    const impuestoGananciasCalculado = (baseDerechos * tasaGanancias) / 100;

    const percepcionIBCalculada = (baseDerechos * tasaPercepcionIB) / 100;

    const costoFinal = baseDerechos + ivaCalculado + ivaAdicionalCalculado +
                      impuestoGananciasCalculado + percepcionIBCalculada +
                      costoTransferenciaBancaria + gastosDespachante;

    const costoTotalEnFOB = valorFOBNumerico > 0 ? costoFinal / valorFOBNumerico : 0;

    setCalculo({
      valorFOB: valorFOBNumerico,
      arancel: arancelCalculado,
      derechoAntidumping: derechoAntidumpingCalculado,
      tasaEstadistica: tasaEstadisticaCalculada,
      baseIVA: baseDerechos,
      iva: ivaCalculado,
      ivaAdicional: ivaAdicionalCalculado,
      impuestoGanancias: impuestoGananciasCalculado,
      percepcionIB: percepcionIBCalculada,
      flete,
      seguro,
      costoTransferenciaBancaria,
      gastosDespachante,
      costoFinal,
      costoTotalEnFOB
    });
  };

  const calcularVenta = () => {
    if (!calculo) return;

    // Deductible import costs (flete, seguro, transferencia, despachante) - operating expenses only
    const gastosOperativosImportacion = flete + seguro + costoTransferenciaBancaria + gastosDespachante;

    // Import taxes (NOT deductible for income tax): arancel, antidumping, tasa estadistica, IVA, IVA adicional, ganancias, IIBB
    const impuestosImportacion = calculo.arancel + calculo.derechoAntidumping + calculo.tasaEstadistica +
                                   calculo.iva + calculo.ivaAdicional + calculo.impuestoGanancias + calculo.percepcionIB;

    // Calculate deductible cost for income tax: FOB + Operating Expenses (NOT including import taxes)
    const costoDeducibleGanancias = valorFOB + gastosOperativosImportacion;

    // Calculate required price to achieve desired net margin
    // Working backwards from desired net margin
    const margenNetoDeseadoDecimal = margenNetoDeseado / 100;

    // This is an iterative approach to find the price that yields the desired net margin
    let precioVenta = costoDeducibleGanancias * (1 + margenNetoDeseadoDecimal * 2); // Initial estimate
    let margenNetoCalculado = 0;
    let iterations = 0;
    const maxIterations = 100;
    const tolerance = 0.0001;

    while (iterations < maxIterations && Math.abs(margenNetoCalculado - margenNetoDeseadoDecimal) > tolerance) {
      // Gross profit based on deductible cost (for AFIP calculation)
      const margenCalculadoAFIP = precioVenta - costoDeducibleGanancias;

      const iibbComercioCalculado = (precioVenta * 3) / 100;
      const iibbIndustriaCalculado = (precioVenta * 1.5) / 100;
      const totalIIBB = iibbComercioCalculado + iibbIndustriaCalculado;

      const comisionCalculada = (precioVenta * comisionVenta) / 100;

      // Income tax base: Gross Profit (based on deductible cost) - Fixed Costs - Commission - Socios' Fees (capped at 25%)
      // Deductible costs: FOB + Operating Expenses (flete, seguro, transferencia, despachante)
      const gananciaBrutaDeducible = precioVenta - costoDeducibleGanancias;
      
      const gananciaImponibleSinHonorarios = gananciaBrutaDeducible - gastosFijos - comisionCalculada;
      const honorariosCalculados = gananciaImponibleSinHonorarios * (porcentajeHonorariosSocios / 100);
      const topeHonorarios = gananciaImponibleSinHonorarios * 0.25;
      const honorariosDeducibles = Math.min(honorariosCalculados, topeHonorarios);
      
      const baseImponibleGanancias = gananciaBrutaDeducible - gastosFijos - comisionCalculada - honorariosDeducibles;
      
      // Income tax is calculated on the tax base, NOT including IIBB
      const impuestoGananciasVentaCalculado = Math.max(0, baseImponibleGanancias * 0.30);

      // Net profit calculation (includes import taxes as real cost)
      const margenCalculadoReal = precioVenta - calculo.costoFinal;
      const gananciaNetaDespuesGanancias = margenCalculadoReal - gastosFijos - comisionCalculada - impuestoGananciasVentaCalculado;

      // REAL net profit (what you actually keep in your pocket) - AFTER IIBB
      const gananciaNetaReal = gananciaNetaDespuesGanancias - totalIIBB;

      // Net margin is based on REAL net profit (what you keep in pocket)
      margenNetoCalculado = gananciaNetaReal / precioVenta;

      // Adjust price based on difference
      const difference = margenNetoCalculado - margenNetoDeseadoDecimal;
      precioVenta = precioVenta * (1 - difference);

      iterations++;
    }

    // Recalculate all values with final price
    const margenCalculadoReal = precioVenta - calculo.costoFinal;
    const iibbComercioCalculado = (precioVenta * 3) / 100;
    const iibbIndustriaCalculado = (precioVenta * 1.5) / 100;
    const totalIIBB = iibbComercioCalculado + iibbIndustriaCalculado;
    const comisionCalculada = (precioVenta * comisionVenta) / 100;

    // Income tax base: Gross Profit (based on deductible cost) - Fixed Costs - Commission - Socios' Fees (capped at 25%)
    // Deductible costs: FOB + Operating Expenses (flete, seguro, transferencia, despachante)
    const gananciaBrutaDeducible = precioVenta - costoDeducibleGanancias;
    
    const gananciaImponibleSinHonorariosFinal = gananciaBrutaDeducible - gastosFijos - comisionCalculada;
    const honorariosCalculadosFinal = gananciaImponibleSinHonorariosFinal * (porcentajeHonorariosSocios / 100);
    const topeHonorariosFinal = gananciaImponibleSinHonorariosFinal * 0.25;
    const honorariosDeduciblesFinal = Math.min(honorariosCalculadosFinal, topeHonorariosFinal);
    const baseImponibleGanancias = gananciaBrutaDeducible - gastosFijos - comisionCalculada - honorariosDeduciblesFinal;
    const impuestoGananciasVentaCalculado = Math.max(0, baseImponibleGanancias * 0.30);

    // Net profit calculation (includes import taxes as real cost)
    const gananciaNetaCalculada = margenCalculadoReal - gastosFijos - comisionCalculada - impuestoGananciasVentaCalculado - totalIIBB;

    // Los honorarios de socios también pagan Ganancias (30%)
    const honorariosNetosFinal = honorariosCalculadosFinal * (1 - 0.30);
    const gananciasSobreHonorarios = honorariosCalculadosFinal * 0.30;

    // Total received by business/socio (net profit + socios' fees after taxes)
    // This represents what actually goes into the partners' pockets
    const totalRecibidoFinal = gananciaNetaCalculada + honorariosNetosFinal;
    
    // Margen neto calculado sobre el total recibido (lo que realmente se lleva en bolsillo)
    const margenNetoCalculadoFinal = (totalRecibidoFinal / precioVenta) * 100;

    const precioVentaEnFOB = valorFOB > 0 ? precioVenta / valorFOB : 0;

    // Precio de venta + IVA (usando el mismo IVA que la importación)
    const ivaVentaCalculado = (precioVenta * tasaIVA) / 100;
    const precioVentaConIVA = precioVenta + ivaVentaCalculado;

    setCalculoVenta({
      costoUnitario: calculo.costoFinal,
      valorFOB,
      impuestosImportacion,
      gastosOperativosImportacion,
      flete,
      seguro,
      transferenciaBancaria: costoTransferenciaBancaria,
      gastosDespachante,
      costoTotalDeducible: gastosOperativosImportacion,
      margenGanancia: margenCalculadoReal,
      precioVenta,
      precioVentaEnFOB,
      precioVentaConIVA,
      baseImponibleGanancias,
      gananciaImponible: baseImponibleGanancias,
      iibbComercio: iibbComercioCalculado,
      iibbIndustria: iibbIndustriaCalculado,
      impuestoGananciasVenta: impuestoGananciasVentaCalculado,
      comisionVenta: comisionCalculada,
      gastosFijos,
      honorariosSocios: honorariosCalculadosFinal,
      honorariosDeducibles: honorariosDeduciblesFinal,
      totalRecibido: totalRecibidoFinal,
      gananciaNeta: gananciaNetaCalculada,
      margenNeto: margenNetoCalculadoFinal
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('importacion')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'importacion'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Costos de Importación
            </button>
            <button
              onClick={() => setActiveTab('venta')}
              disabled={!calculo}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'venta'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${!calculo ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              💰 Precio de Venta
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* Importación Tab */}
          {activeTab === 'importacion' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Datos de Importación</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor FOB (USD)</label>
                  <input
                    type="number"
                    value={valorFOB}
                    onChange={(e) => setValorFOB(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Ej: 1000"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Impuestos Aduaneros</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arancel ({tasaArancel}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      step="0.5"
                      value={tasaArancel}
                      onChange={(e) => setTasaArancel(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">Tasa arancelaria según NCM</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Derecho Antidumping ({tasaAntidumping}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={tasaAntidumping}
                      onChange={(e) => setTasaAntidumping(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">Si aplica al producto</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Impuestos al Valor</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IVA</label>
                    <select
                      value={tasaIVA}
                      onChange={(e) => setTasaIVA(parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="21">21% (General)</option>
                      <option value="10.5">10.5% (Bienes de capital)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IVA Adicional</label>
                    <select
                      value={tipoIVAAdicional}
                      onChange={(e) => setTipoIVAAdicional(e.target.value as '10' | '20')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="10">10% del IVA General</option>
                      <option value="20">20% del IVA General</option>
                    </select>
                    <div className="text-sm text-gray-500">Percepción de IVA (10-20% según producto)</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impuesto a las Ganancias ({tasaGanancias}%)
                    </label>
                    <input
                      type="number"
                      value={tasaGanancias}
                      onChange={(e) => setTasaGanancias(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <div className="text-sm text-gray-500">Anticipo de Ganancias (6-11%)</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingresos Brutos ({tasaPercepcionIB}%)
                    </label>
                    <input
                      type="number"
                      value={tasaPercepcionIB}
                      onChange={(e) => setTasaPercepcionIB(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <div className="text-sm text-gray-500">3% comercio, 1.5% industria</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Gastos Adicionales</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flete (USD)</label>
                    <input
                      type="number"
                      value={flete}
                      onChange={(e) => setFlete(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Ej: 150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seguro (USD)</label>
                    <input
                      type="number"
                      value={seguro}
                      onChange={(e) => setSeguro(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Ej: 50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Costo Transferencia Bancaria (USD)</label>
                    <input
                      type="number"
                      value={costoTransferenciaBancaria}
                      onChange={(e) => setCostoTransferenciaBancaria(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Ej: 30"
                    />
                    <div className="text-sm text-gray-500">Comisión por transferencia internacional</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gastos Despachante (USD)</label>
                    <input
                      type="number"
                      value={gastosDespachante}
                      onChange={(e) => setGastosDespachante(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Ej: 100"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {calculo && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-green-900 mb-4">✅ Resumen de Costos</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Valor FOB</span>
                          <span className="font-medium">{formatCurrency(calculo.valorFOB)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">+ Flete</span>
                          <span className="font-medium">{formatCurrency(calculo.flete)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">+ Seguro</span>
                          <span className="font-medium">{formatCurrency(calculo.seguro)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b-2 border-green-300">
                          <span className="font-semibold">Valor CIF</span>
                          <span className="font-semibold">{formatCurrency(calculo.valorFOB + calculo.flete + calculo.seguro)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Arancel ({tasaArancel}%)</span>
                          <span className="font-medium text-orange-600">{formatCurrency(calculo.arancel)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Derecho Antidumping ({tasaAntidumping}%)</span>
                          <span className="font-medium text-orange-600">{formatCurrency(calculo.derechoAntidumping)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Tasa Estadística (0.5%)</span>
                          <span className="font-medium text-orange-600">{formatCurrency(calculo.tasaEstadistica)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b-2 border-green-300">
                          <span className="font-semibold">Base para Impuestos</span>
                          <span className="font-semibold">{formatCurrency(calculo.baseIVA)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">IVA ({tasaIVA}%)</span>
                          <span className="font-medium text-red-600">{formatCurrency(calculo.iva)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">IVA Adicional ({tipoIVAAdicional}% del IVA)</span>
                          <span className="font-medium text-red-600">{formatCurrency(calculo.ivaAdicional)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Impuesto Ganancias ({tasaGanancias}%)</span>
                          <span className="font-medium text-red-600">{formatCurrency(calculo.impuestoGanancias)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Ingresos Brutos ({tasaPercepcionIB}%)</span>
                          <span className="font-medium text-red-600">{formatCurrency(calculo.percepcionIB)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-green-200">
                          <span className="text-gray-700">Costo Transferencia Bancaria</span>
                          <span className="font-medium">{formatCurrency(calculo.costoTransferenciaBancaria)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b-2 border-green-400">
                          <span className="text-gray-700">Gastos Despachante</span>
                          <span className="font-medium">{formatCurrency(calculo.gastosDespachante)}</span>
                        </div>
                        <div className="flex justify-between py-3 bg-green-100 rounded-lg px-4 mt-4">
                          <span className="font-bold text-lg text-green-900">💰 COSTO FINAL</span>
                          <span className="font-bold text-lg text-green-900">{formatCurrency(calculo.costoFinal)}</span>
                        </div>
                        <div className="mt-4 p-3 bg-green-100 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-semibold">Costo total en FOB:</span>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {calculo.costoTotalEnFOB.toFixed(2)}x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Distribution Chart */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-blue-900 mb-4">📊 Distribución de Costos</h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: 'Valor FOB', value: calculo.valorFOB, color: 'bg-blue-600' },
                          { label: 'Arancel + Antidumping', value: calculo.arancel + calculo.derechoAntidumping, color: 'bg-orange-500' },
                          { 
                            label: 'Impuestos (IVA, IVA Adic, Ganancias, IIBB)', 
                            value: calculo.iva + calculo.ivaAdicional + calculo.impuestoGanancias + calculo.percepcionIB, 
                            color: 'bg-red-500' 
                          },
                          { 
                            label: 'Flete + Seguro + Otros', 
                            value: calculo.flete + calculo.seguro + calculo.gastosDespachante + calculo.costoTransferenciaBancaria + calculo.tasaEstadistica, 
                            color: 'bg-purple-500' 
                          },
                        ].map((item, index) => {
                          const percentage = (item.value / calculo.costoFinal) * 100;
                          return (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700">{item.label}</span>
                                <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-6">
                                <div 
                                  className={`${item.color} h-6 rounded-full transition-all duration-300`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Venta Tab */}
          {activeTab === 'venta' && calculo && calculoVenta && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs Venta */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💼 Datos de Venta</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margen Neto Deseado (%)
                  </label>
                  <input
                    type="number"
                    value={margenNetoDeseado}
                    onChange={(e) => setMargenNetoDeseado(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <div className="text-sm text-gray-500">Margen de ganancia neta deseado</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comisión de Venta (%)
                  </label>
                  <input
                    type="number"
                    value={comisionVenta}
                    onChange={(e) => setComisionVenta(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gastos Fijos (USD)
                  </label>
                  <input
                    type="number"
                    value={gastosFijos}
                    onChange={(e) => setGastosFijos(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Honorarios Socios (%)
                  </label>
                  <input
                    type="number"
                    value={porcentajeHonorariosSocios}
                    onChange={(e) => setPorcentajeHonorariosSocios(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <div className="text-sm text-gray-500">Máximo deducible: 25%</div>
                </div>
              </div>

              {/* Results Venta */}
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-purple-900 mb-4">💰 Análisis de Venta</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-purple-200">
                      <span className="text-gray-700">Costo Unitario</span>
                      <span className="font-medium">{formatCurrency(calculoVenta.costoUnitario)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-200">
                      <span className="text-gray-700">Precio de Venta</span>
                      <span className="font-medium text-purple-600">{formatCurrency(calculoVenta.precioVenta)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-200">
                      <span className="text-gray-700">Precio + IVA</span>
                      <span className="font-medium text-purple-600">{formatCurrency(calculoVenta.precioVentaConIVA)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b-2 border-purple-300">
                      <span className="font-semibold">Precio en FOB</span>
                      <span className="font-semibold">{calculoVenta.precioVentaEnFOB.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-200">
                      <span className="text-gray-700">Margen Neto</span>
                      <span className="font-medium text-green-600">{calculoVenta.margenNeto.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between py-3 bg-purple-100 rounded-lg px-4 mt-4">
                      <span className="font-bold text-lg text-purple-900">Total Recibido</span>
                      <span className="font-bold text-lg text-purple-900">{formatCurrency(calculoVenta.totalRecibido)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">📊 Desglose Impuestos Venta</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">IIBB Comercio (3%)</span>
                      <span>{formatCurrency(calculoVenta.iibbComercio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IIBB Industria (1.5%)</span>
                      <span>{formatCurrency(calculoVenta.iibbIndustria)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impuesto Ganancias (30%)</span>
                      <span>{formatCurrency(calculoVenta.impuestoGananciasVenta)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comisión Venta</span>
                      <span>{formatCurrency(calculoVenta.comisionVenta)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Honorarios Socios</span>
                      <span>{formatCurrency(calculoVenta.honorariosSocios)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}