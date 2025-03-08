import { defineConfig } from 'astro/config';
import fs from 'fs';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './src/utils/remark-reading-time';
import icon from 'astro-icon';
import expressiveCode from 'astro-expressive-code';
import { expressiveCodeOptions } from './src/site.config';
// import vercelAdapter from '@astrojs/vercel';

import astroStarlightRemarkAsides from 'astro-starlight-remark-asides';
import remarkDirective from 'remark-directive';

// https://astro.build/config
export default defineConfig({
  site: 'https://nickhodges.com/',
  output: 'static',
  // Comment out adapter for local builds - uncomment for deployment
  // adapter: vercelAdapter({
  //   webAnalytics: {
  //     enabled: true,
  //   },
  //   analytics: true,
  // }),
  markdown: {
    remarkPlugins: [remarkUnwrapImages, remarkReadingTime, remarkDirective, astroStarlightRemarkAsides],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow, noopener, noreferrer'],
        },
      ],
    ],
    remarkRehype: {
      footnoteLabelProperties: {
        className: [''],
      },
    },
  },
  integrations: [
    expressiveCode(expressiveCodeOptions),
    icon(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
  ],
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  vite: {
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
    plugins: [rawFonts(['.ttf', '.woff'])],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
});
function rawFonts(ext: Array<string>) {
  return {
    name: 'vite-plugin-raw-fonts',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
