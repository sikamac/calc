export function pushDataLayerEvent(event: string, data: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push({ event, ...data });
  }
}
