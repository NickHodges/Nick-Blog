import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

type BlogCollection = 'post' | 'delphi';

/** Minimal shape needed for date sorting and tag helpers. */
type DatedEntry = {
  data: {
    publishDate: Date;
    updatedDate: Date | undefined;
    draft?: boolean | undefined;
    tags: string[];
  };
};

/** Filters out draft posts in production. */
export async function getPublishedEntries<C extends BlogCollection>(collection: C): Promise<Array<CollectionEntry<C>>> {
  return await getCollection(collection, ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}

/** Returns a new array sorted by updatedDate (or publishDate), newest first. */
export function sortMDByDate<T extends DatedEntry>(posts: Array<T>): Array<T> {
  return [...posts].sort((a, b) => {
    const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf();
    const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf();
    return bDate - aDate;
  });
}

export function getAllTags<T extends DatedEntry>(posts: Array<T>): string[] {
  return posts.flatMap((post) => [...post.data.tags]);
}

export function getUniqueTags<T extends DatedEntry>(posts: Array<T>): string[] {
  return [...new Set(getAllTags(posts))];
}

export function getUniqueTagsWithCount<T extends DatedEntry>(posts: Array<T>): Array<[string, number]> {
  return [...getAllTags(posts).reduce((acc, t) => acc.set(t, (acc.get(t) || 0) + 1), new Map<string, number>())].sort(
    (a, b) => b[1] - a[1],
  );
}
