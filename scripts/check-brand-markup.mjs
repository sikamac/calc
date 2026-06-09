import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const contentDir = join(process.cwd(), 'src/content');
const brandPattern = /GIST POINT(?: S\.A\.S\.)?/g;
const wrappedPattern = /<span\s+class=["']brand-name["'][^>]*>GIST POINT(?: S\.A\.S\.)?<\/span>/g;

function listMarkdownFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory()
      ? listMarkdownFiles(fullPath)
      : fullPath.endsWith('.md')
        ? [fullPath]
        : [];
  });
}

function withoutFrontmatter(source) {
  if (!source.startsWith('---')) return source;
  const end = source.indexOf('\n---', 3);
  return end === -1 ? source : source.slice(end + 4);
}

function stripWrappedBrand(line) {
  return line.replace(wrappedPattern, '');
}

const violations = [];

for (const file of listMarkdownFiles(contentDir)) {
  const body = withoutFrontmatter(readFileSync(file, 'utf8'));
  let inCodeFence = false;

  body.split('\n').forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      inCodeFence = !inCodeFence;
      return;
    }

    if (inCodeFence) return;

    const remaining = stripWrappedBrand(line);
    if (brandPattern.test(remaining)) {
      violations.push(`${file}:${index + 1}: ${line.trim()}`);
    }

    brandPattern.lastIndex = 0;
  });
}

if (violations.length > 0) {
  console.error('Menciones visibles de marca sin <span class="brand-name">:');
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log('Menciones de marca en Markdown verificadas.');
