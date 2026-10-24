import { defineConfig, envField, fontProviders, sessionDrivers } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

const { REDIS_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
import sitemap from '@astrojs/sitemap';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './src/utils/remark-reading-time';
import icon from 'astro-icon';
import vercelAdapter from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import respectify from '@respectify/astro';
import { COMMENTS_API_PATH } from './src/lib/comments-config';

import astroStarlightRemarkAsides from 'astro-starlight-remark-asides';
import remarkDirective from 'remark-directive';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.nickhodges.com/',
  output: 'server',
  adapter: vercelAdapter({
    webAnalytics: {
      enabled: true,
    },
    // Runtime fs.readFile of Respectify config needs this in the serverless bundle
    includeFiles: ['./respectify.config.json'],
  }),
  session: {
    driver: sessionDrivers.redis({
      url: REDIS_URL ?? process.env.REDIS_URL ?? '',
    }),
    cookie: {
      name: 'session',
      sameSite: 'lax',
      secure: true,
    },
    ttl: 604800, // 7 days in seconds
  },
  markdown: {
    syntaxHighlight: 'prism',
    // The remark/rehype pipeline; Astro 7's default (Sätteri) doesn't run these plugins
    processor: unified({
      remarkPlugins: [remarkUnwrapImages, remarkReadingTime, remarkDirective, astroStarlightRemarkAsides],
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['nofollow', 'noopener', 'noreferrer'],
          },
        ],
      ],
      remarkRehype: {
        footnoteLabelProperties: {
          className: [''],
        },
      },
    }),
  },
  integrations: [
    respectify({
      runtime: './src/respectify.runtime.ts',
      commentsApiPath: COMMENTS_API_PATH,
    }),
    icon(),
    sitemap(),
    mdx(),
  ],
  // Astro 6's whitespace handling; Astro 7's default ('jsx') runs adjacent inline elements together
  compressHTML: true,
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Roboto Mono',
      cssVariable: '--font-mono',
      options: {
        variants: [
          {
            src: ['./src/assets/roboto-mono-regular.ttf'],
            weight: 400,
            style: 'normal',
          },
          {
            src: ['./src/assets/roboto-mono-700.ttf'],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    },
  ],
  env: {
    schema: {
      RESPECTIFY_EMAIL: envField.string({ context: 'server', access: 'secret' }),
      RESPECTIFY_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_EMAIL: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      REDIS_URL: envField.string({ context: 'server', access: 'secret' }),
      // The comments database (Turso). Required on Vercel deployments; local work uses .data/comments.db
      ASTRO_DB_REMOTE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      ASTRO_DB_APP_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Set by Vercel on its deployments
      VERCEL_ENV: envField.enum({ context: 'server', access: 'public', values: ['production', 'preview', 'development'], optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': '/src/components',
      },
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
});
