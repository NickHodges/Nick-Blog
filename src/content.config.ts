import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array;
  const lowercaseItems = array.map((str) => str.toLowerCase());
  const distinctItems = new Set(lowercaseItems);
  return Array.from(distinctItems);
}

const post = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/post' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60),
      author: z.string().optional(),
      description: z.string().min(20).max(160),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .or(z.date())
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      coverImage: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      ogImage: z.string().optional(),
    }),
});

const info = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/info' }),
  schema: () =>
    z.object({
      title: z.string().max(60).optional(),
      author: z.string().optional().default('Nick'),
      draft: z.boolean().default(false),
      ogImage: z.string().optional(),
    }),
});

const delphi = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/delphi' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      author: z.string().optional().default('Nick Hodges'),
      description: z.string().min(20).max(300),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .or(z.date())
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      postSlug: z.string().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      ogImage: z.string().optional(),
      coverImage: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
    }),
});

export const collections = { post, info, delphi };
