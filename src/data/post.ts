import type { CollectionEntry } from 'astro:content';
import {
  getAllTags as getAllTagsHelper,
  getPublishedEntries,
  getUniqueTags as getUniqueTagsHelper,
  getUniqueTagsWithCount as getUniqueTagsWithCountHelper,
  sortMDByDate as sortMDByDateHelper,
} from './collection-helpers';

/** Note: this function filters out draft posts based on the environment */
export async function getAllPosts(): Promise<Array<CollectionEntry<'post'>>> {
  return getPublishedEntries('post');
}

export function sortMDByDate(posts: Array<CollectionEntry<'post'>>) {
  return sortMDByDateHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(posts: Array<CollectionEntry<'post'>>) {
  return getAllTagsHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(posts: Array<CollectionEntry<'post'>>) {
  return getUniqueTagsHelper(posts);
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(posts: Array<CollectionEntry<'post'>>): Array<[string, number]> {
  return getUniqueTagsWithCountHelper(posts);
}
