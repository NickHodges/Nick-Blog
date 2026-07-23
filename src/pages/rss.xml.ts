export const prerender = true;

import rss from '@astrojs/rss';
import { siteConfig } from '@site-config';
import { getAllPosts } from '@data/post';
import { getAllDelphiPosts } from '@data/delphi';
import { sortMDByDate } from '@data/collection-helpers';

export const GET = async () => {
  const posts = await getAllPosts();
  const delphiPosts = await getAllDelphiPosts();
  const items = sortMDByDate([...posts, ...delphiPosts]);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,
    items: items.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `posts/${post.id}`,
    })),
  });
};
