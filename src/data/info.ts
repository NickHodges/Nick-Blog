import { getCollection } from 'astro:content';

/** Note: this function filters out draft posts based on the environment */
export async function getAllInfoPosts() {
  return await getCollection('info', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}
