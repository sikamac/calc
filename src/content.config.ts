import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    image: z.string().optional(),
    description: z.string(),
    author: z.string().default('Equipo de GIST POINT'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articulos };
