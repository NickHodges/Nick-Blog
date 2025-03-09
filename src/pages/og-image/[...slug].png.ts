import type { APIContext, InferGetStaticPropsType } from 'astro';
import satori, { type SatoriOptions } from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { siteConfig } from '@site-config';
import { getFormattedDate } from '@utils';
import { getAllPosts } from '@data/post';

// After
import type { ReactNode } from 'react';

import RobotoMono from '@assets/roboto-mono-regular.ttf';
import RobotoMonoBold from '@assets/roboto-mono-700.ttf';
import fs from 'node:fs';
import path from 'node:path';

const ogOptions: SatoriOptions = {
  width: 1200,
  height: 630,
  // debug: true,
  fonts: [
    {
      name: 'Roboto Mono',
      data: Buffer.from(RobotoMono),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Roboto Mono',
      data: Buffer.from(RobotoMonoBold),
      weight: 700,
      style: 'normal',
    },
  ],
};

// Load the nick avatar image as base64
const avatarImagePath = path.join(process.cwd(), 'src', 'assets', 'nick.png');
const avatarImageData = fs.readFileSync(avatarImagePath);
const avatarBase64 = `data:image/png;base64,${avatarImageData.toString('base64')}`;

const markup = (title: string, pubDate: string) => html`
  <div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
    <div tw="flex flex-col flex-1 w-full p-10 justify-center">
      <p tw="text-2xl mb-6">${pubDate}</p>
      <h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
    </div>
    <div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
      <div tw="flex items-center">
        <img src="${avatarBase64}" width="60" height="60" alt="Nick Image" tw="rounded-full" />
        <p tw="ml-3 font-semibold">${siteConfig.title}</p>
      </div>
      <p>by ${siteConfig.author}</p>
    </div>
  </div>
`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { title, pubDate } = context.props as Props;

  const postDate = getFormattedDate(pubDate, {
    weekday: 'long',
    month: 'long',
  });
  //const svg = await satori(markup(title, postDate), ogOptions);
  const svg = await satori(markup(title, postDate) as unknown as ReactNode, ogOptions);
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .map((post) => ({
      params: { slug: post.slug },
      props: {
        title: post.data.title,
        pubDate: post.data.updatedDate ?? post.data.publishDate,
      },
    }));
}
