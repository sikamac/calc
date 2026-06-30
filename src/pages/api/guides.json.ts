import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const entries = await getCollection('articulos');
  const guides = entries
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      category: entry.data.category,
      tags: entry.data.tags,
      url: `/blog/${entry.id.replace(/\.md$/, '')}`,
      updatedAt: (entry.data.updatedDate ?? entry.data.date).toISOString(),
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return new Response(JSON.stringify({ guides }), {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
