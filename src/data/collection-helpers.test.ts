import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

/** Mirrors src/data/collection-helpers.ts sort/tag helpers (Astro-free for Node tests). */
type DatedEntry = {
  id: string;
  data: {
    publishDate: Date;
    updatedDate: Date | undefined;
    tags: string[];
  };
};

function sortMDByDate<T extends DatedEntry>(posts: Array<T>): Array<T> {
  return [...posts].sort((a, b) => {
    const aDate = new Date(a.data.updatedDate ?? a.data.publishDate).valueOf();
    const bDate = new Date(b.data.updatedDate ?? b.data.publishDate).valueOf();
    return bDate - aDate;
  });
}

function getAllTags<T extends DatedEntry>(posts: Array<T>): string[] {
  return posts.flatMap((post) => [...post.data.tags]);
}

function getUniqueTags<T extends DatedEntry>(posts: Array<T>): string[] {
  return [...new Set(getAllTags(posts))];
}

function getUniqueTagsWithCount<T extends DatedEntry>(posts: Array<T>): Array<[string, number]> {
  return [...getAllTags(posts).reduce((acc, t) => acc.set(t, (acc.get(t) || 0) + 1), new Map<string, number>())].sort(
    (a, b) => b[1] - a[1],
  );
}

describe('collection-helpers logic', () => {
  const posts: DatedEntry[] = [
    {
      id: 'older',
      data: {
        publishDate: new Date('2020-01-01'),
        updatedDate: undefined,
        tags: ['delphi', 'testing'],
      },
    },
    {
      id: 'newer',
      data: {
        publishDate: new Date('2021-01-01'),
        updatedDate: new Date('2022-06-01'),
        tags: ['testing', 'astro'],
      },
    },
  ];

  it('sortMDByDate returns a new array newest-first without mutating input', () => {
    const originalOrder = posts.map((p) => p.id);
    const sorted = sortMDByDate(posts);

    assert.deepEqual(
      sorted.map((p) => p.id),
      ['newer', 'older'],
    );
    assert.deepEqual(
      posts.map((p) => p.id),
      originalOrder,
    );
  });

  it('getUniqueTags dedupes tags', () => {
    assert.deepEqual(getUniqueTags(posts).sort(), ['astro', 'delphi', 'testing']);
  });

  it('getUniqueTagsWithCount sorts by frequency', () => {
    assert.deepEqual(getUniqueTagsWithCount(posts), [
      ['testing', 2],
      ['delphi', 1],
      ['astro', 1],
    ]);
  });
});
