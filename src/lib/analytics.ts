export function pushDataLayerEvent(event: string, data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}
