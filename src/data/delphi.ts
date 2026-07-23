import type { CollectionEntry } from 'astro:content';
import {
  getAllTags as getAllTagsHelper,
  getPublishedEntries,
  getUniqueTags as getUniqueTagsHelper,
  getUniqueTagsWithCount as getUniqueTagsWithCountHelper,
  sortMDByDate as sortMDByDateHelper,
} from './collection-helpers';

/** Note: this function filters out draft posts based on the environment */
export async function getAllDelphiPosts(): Promise<Array<CollectionEntry<'delphi'>>> {
  return getPublishedEntries('delphi');
}

export function sortMDByDate(posts: Array<CollectionEntry<'delphi'>>) {
  return sortMDByDateHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllDelphiPosts above to do so. */
export function getAllTags(posts: Array<CollectionEntry<'delphi'>>) {
  return getAllTagsHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllDelphiPosts above to do so. */
export function getUniqueTags(posts: Array<CollectionEntry<'delphi'>>) {
  return getUniqueTagsHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllDelphiPosts above to do so. */
export function getUniqueTagsWithCount(posts: Array<CollectionEntry<'delphi'>>): Array<[string, number]> {
  return getUniqueTagsWithCountHelper(posts);
}
