import { defineDb } from 'astro:db';
import { Comment } from '../packages/astro-respectify/src/schema.ts';

export default defineDb({
  tables: { Comment },
});
