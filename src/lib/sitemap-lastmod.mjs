import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARTICLES_DIR = fileURLToPath(new URL('../content/articulos/', import.meta.url));
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

function readFrontmatterDate(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+)["']?`, 'm'));
  return match?.[1]?.trim();
}

function toIsoDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }

  return date.toISOString();
}

function getArticleLastmodByPath() {
  return readdirSync(ARTICLES_DIR)
    .filter((filename) => filename.endsWith('.md'))
    .reduce((lastmodByPath, filename) => {
      const source = readFileSync(join(ARTICLES_DIR, filename), 'utf8');
      const frontmatter = source.match(FRONTMATTER_RE)?.[1];

      if (!frontmatter) {
        return lastmodByPath;
      }

      const selectedDate = readFrontmatterDate(frontmatter, 'updatedDate') ?? readFrontmatterDate(frontmatter, 'date');
      const lastmod = selectedDate ? toIsoDate(selectedDate) : undefined;

      if (lastmod) {
        const slug = filename.replace(/\.md$/, '');
        lastmodByPath.set(`/blog/${slug}`, lastmod);
      }

      return lastmodByPath;
    }, new Map());
}

const articleLastmodByPath = getArticleLastmodByPath();

export function addSitemapLastmod(item) {
  const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
  const lastmod = articleLastmodByPath.get(pathname);

  if (!lastmod) {
    return item;
  }

  return {
    ...item,
    lastmod,
  };
}
