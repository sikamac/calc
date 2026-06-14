export function normalizeCanonicalUrl(
  href: string,
  siteUrl: string,
  options: { preserveHash?: boolean } = {}
) {
  const normalized = new URL(href, siteUrl);

  if (normalized.pathname === '/index.html') {
    normalized.pathname = '/';
  } else if (normalized.pathname.endsWith('.html')) {
    normalized.pathname = normalized.pathname.slice(0, -5);
  }

  if (normalized.pathname !== '/' && normalized.pathname.endsWith('/')) {
    normalized.pathname = normalized.pathname.slice(0, -1);
  }

  normalized.search = '';
  if (!options.preserveHash) {
    normalized.hash = '';
  }

  return normalized.href.replace(/\/$/, '');
}

export function normalizeSchemaUrls(value: unknown, siteUrl: string): unknown {
  if (typeof value === 'string' && value.startsWith(siteUrl)) {
    return normalizeCanonicalUrl(value, siteUrl, { preserveHash: true });
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeSchemaUrls(item, siteUrl));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeSchemaUrls(nestedValue, siteUrl),
      ])
    );
  }

  return value;
}
