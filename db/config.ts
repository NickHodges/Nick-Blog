import { defineDb, defineTable, column, NOW } from 'astro:db';

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    postSlug: column.text(),
    author: column.text(),
    email: column.text({ optional: true }),
    content: column.text(),
    createdAt: column.date({ default: NOW }),
    approved: column.boolean({ default: false }),
    parentId: column.number({ optional: true }),
  },
  indexes: [
    { on: ['postSlug'], unique: false },
    { on: ['approved'], unique: false },
  ],
});

export default defineDb({
  tables: { Comment },
});
