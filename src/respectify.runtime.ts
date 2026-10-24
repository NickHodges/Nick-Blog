import { defineRespectifyRuntime } from '@respectify/astro/runtime';
import { createSqliteCommentStore } from '@respectify/astro/sqlite';
import { commentsDatabase } from './lib/comments/comments-database';

export default defineRespectifyRuntime({
  store: createSqliteCommentStore(commentsDatabase),
  getPostUrl: (slug, site) => `${site.replace(/\/$/, '')}/posts/${slug}/`,
});
