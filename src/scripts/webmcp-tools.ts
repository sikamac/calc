type ToolInput = Record<string, unknown>;

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: ToolInput) => unknown | Promise<unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
}

interface ModelContext {
  registerTool: (tool: WebMcpTool) => void;
}

interface Guide {
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  updatedAt: string;
}

interface WebMcpWindow extends Window {
  __calcWebMcpToolsRegistered?: boolean;
}

const RATE_MAX = 100;

function readNumber(
  input: ToolInput,
  key: string,
  defaultValue: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
) {
  const rawValue = input[key];
  if (rawValue === undefined || rawValue === null || rawValue === '') return defaultValue;

  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${key} debe ser un número entre ${min} y ${max}.`);
  }

  return value;
}

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function estimateImportCost(input: ToolInput) {
  const valorEXW = readNumber(input, 'valor_exw', 0, 0.01);
  const flete = readNumber(input, 'flete', 0);
  const seguro = readNumber(input, 'seguro', 0);
  const tasaArancel = readNumber(input, 'tasa_arancel', 18, 0, 35);
  const tasaAntidumping = readNumber(input, 'tasa_antidumping', 0, 0, RATE_MAX);
  const tasaIVA = readNumber(input, 'tasa_iva', 21, 0, RATE_MAX);
  const tasaIVAAdicional = readNumber(input, 'tasa_iva_adicional', 20, 0, RATE_MAX);
  const tasaGanancias = readNumber(input, 'tasa_ganancias', 6, 0, RATE_MAX);
  const tasaIngresosBrutos = readNumber(input, 'tasa_ingresos_brutos', 2.5, 0, RATE_MAX);
  const transferenciaBancaria = readNumber(input, 'transferencia_bancaria', 0);
  const gastosDespachante = readNumber(input, 'gastos_despachante', 0);
  const depositoYManejo = readNumber(input, 'deposito_y_manejo', 0);

  const valorCIF = valorEXW + flete + seguro;
  const arancel = valorCIF * tasaArancel / 100;
  const antidumping = valorCIF * tasaAntidumping / 100;
  const tasaEstadisticaSinTope = valorEXW * 0.005;
  const topeTasaEstadistica = valorEXW <= 10_000
    ? 180
    : valorEXW <= 100_000
      ? 3_000
      : valorEXW <= 1_000_000
        ? 30_000
        : 150_000;
  const tasaEstadistica = Math.min(tasaEstadisticaSinTope, topeTasaEstadistica);
  const baseImponible = valorCIF + arancel + antidumping + tasaEstadistica;
  const iva = baseImponible * tasaIVA / 100;
  const ivaAdicional = baseImponible * tasaIVAAdicional / 100;
  const percepcionGanancias = baseImponible * tasaGanancias / 100;
  const ingresosBrutos = baseImponible * tasaIngresosBrutos / 100;
  const costoFinal = baseImponible + iva + ivaAdicional + percepcionGanancias
    + ingresosBrutos + transferenciaBancaria + gastosDespachante + depositoYManejo;

  return {
    currency: 'USD',
    inputs: {
      valor_exw: valorEXW,
      flete,
      seguro,
      tasa_arancel: tasaArancel,
      tasa_antidumping: tasaAntidumping,
      tasa_iva: tasaIVA,
      tasa_iva_adicional: tasaIVAAdicional,
      tasa_ganancias: tasaGanancias,
      tasa_ingresos_brutos: tasaIngresosBrutos,
      transferencia_bancaria: transferenciaBancaria,
      gastos_despachante: gastosDespachante,
      deposito_y_manejo: depositoYManejo,
    },
    breakdown: {
      valor_cif: roundCurrency(valorCIF),
      arancel: roundCurrency(arancel),
      antidumping: roundCurrency(antidumping),
      tasa_estadistica: roundCurrency(tasaEstadistica),
      base_imponible: roundCurrency(baseImponible),
      iva: roundCurrency(iva),
      iva_adicional: roundCurrency(ivaAdicional),
      percepcion_ganancias: roundCurrency(percepcionGanancias),
      ingresos_brutos: roundCurrency(ingresosBrutos),
      gastos_operativos: roundCurrency(transferenciaBancaria + gastosDespachante + depositoYManejo),
    },
    result: {
      costo_final: roundCurrency(costoFinal),
      multiplicador_sobre_exw: Math.round((costoFinal / valorEXW) * 100) / 100,
    },
    disclaimer: 'Estimación educativa. Verificá NCM, normativa y alícuotas con profesionales antes de operar.',
  };
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-AR')
    .trim();
}

let guidesPromise: Promise<Guide[]> | undefined;

function loadGuides() {
  guidesPromise ??= fetch('/api/guides.json')
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo cargar el índice de guías.');
      return response.json() as Promise<{ guides: Guide[] }>;
    })
    .then(({ guides }) => guides);

  return guidesPromise;
}

async function findImportGuide(input: ToolInput) {
  const rawQuery = typeof input.query === 'string' ? input.query.trim() : '';
  if (rawQuery.length < 2 || rawQuery.length > 160) {
    throw new Error('query debe contener entre 2 y 160 caracteres.');
  }

  const rawCategory = typeof input.category === 'string' ? input.category.trim() : '';
  const query = normalize(rawQuery);
  const queryTerms = query.split(/\s+/).filter((term) => term.length > 1);
  const category = normalize(rawCategory);
  const guides = await loadGuides();

  const matches = guides
    .filter((guide) => !category || normalize(guide.category) === category)
    .map((guide) => {
      const title = normalize(guide.title);
      const description = normalize(guide.description);
      const tags = guide.tags.map(normalize);
      const searchable = `${title} ${description} ${tags.join(' ')} ${normalize(guide.category)}`;
      let score = title.includes(query) ? 12 : 0;
      score += tags.some((tag) => tag.includes(query)) ? 8 : 0;
      score += description.includes(query) ? 5 : 0;
      score += queryTerms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
      return { guide, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.guide.updatedAt.localeCompare(a.guide.updatedAt))
    .slice(0, 5)
    .map(({ guide }) => ({
      title: guide.title,
      description: guide.description,
      category: guide.category,
      url: new URL(guide.url, window.location.origin).href,
      updated_at: guide.updatedAt,
    }));

  return {
    query: rawQuery,
    category: rawCategory || null,
    count: matches.length,
    guides: matches,
  };
}

export function registerWebMcpTools() {
  const webMcpDocument = document as Document & { modelContext?: ModelContext };
  const modelContext = webMcpDocument.modelContext;
  const webMcpWindow = window as WebMcpWindow;

  if (!modelContext || webMcpWindow.__calcWebMcpToolsRegistered) return;
  webMcpWindow.__calcWebMcpToolsRegistered = true;

  modelContext.registerTool({
    name: 'estimate_import_cost',
    description: 'Estima en USD los principales costos de una importación a Argentina. Es una simulación educativa y no reemplaza una cotización ni asesoramiento profesional.',
    inputSchema: {
      type: 'object',
      properties: {
        valor_exw: { type: 'number', minimum: 0.01, description: 'Valor EXW de la mercadería en USD.' },
        flete: { type: 'number', minimum: 0, default: 0, description: 'Flete internacional en USD.' },
        seguro: { type: 'number', minimum: 0, default: 0, description: 'Seguro internacional en USD.' },
        tasa_arancel: { type: 'number', minimum: 0, maximum: 35, default: 18, description: 'Derecho de importación porcentual según NCM.' },
        tasa_antidumping: { type: 'number', minimum: 0, maximum: 100, default: 0 },
        tasa_iva: { type: 'number', minimum: 0, maximum: 100, default: 21 },
        tasa_iva_adicional: { type: 'number', minimum: 0, maximum: 100, default: 20 },
        tasa_ganancias: { type: 'number', minimum: 0, maximum: 100, default: 6 },
        tasa_ingresos_brutos: { type: 'number', minimum: 0, maximum: 100, default: 2.5 },
        transferencia_bancaria: { type: 'number', minimum: 0, default: 0 },
        gastos_despachante: { type: 'number', minimum: 0, default: 0 },
        deposito_y_manejo: { type: 'number', minimum: 0, default: 0 },
      },
      required: ['valor_exw'],
      additionalProperties: false,
    },
    execute: estimateImportCost,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: false,
    },
  });

  modelContext.registerTool({
    name: 'find_import_guide',
    description: 'Busca hasta cinco guías del sitio sobre importaciones, NCM, impuestos, costos, courier, Incoterms y rentabilidad.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 2, maxLength: 160, description: 'Tema o pregunta que se quiere investigar.' },
        category: { type: 'string', description: 'Categoría opcional, por ejemplo Impuestos, Courier, Logística o Finanzas.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    execute: findImportGuide,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: false,
    },
  });
}
