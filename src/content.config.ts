import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    category: z.string(),
    image: image().optional(),
    description: z.string(),
    author: z.string().default('Equipo de GIST POINT'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articulos };
