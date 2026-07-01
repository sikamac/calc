export function pushDataLayerEvent(event: string, data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...data });
}
