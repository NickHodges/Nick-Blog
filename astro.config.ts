import { defineConfig, envField, fontProviders, sessionDrivers } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

const { REDIS_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
import sitemap from '@astrojs/sitemap';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkReadingTime } from './src/utils/remark-reading-time';
import icon from 'astro-icon';
import vercelAdapter from '@astrojs/vercel';
import db from '@astrojs/db';

import astroStarlightRemarkAsides from 'astro-starlight-remark-asides';
import remarkDirective from 'remark-directive';

// https://astro.build/config
export default defineConfig({
  site: 'https://nickhodges.com/',
  output: 'server',
  adapter: vercelAdapter({
    webAnalytics: {
      enabled: true,
    },
  }),
  session: {
    driver: sessionDrivers.redis({
      url: REDIS_URL,
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
  security: {
    csp: {
      scriptDirective: {
        resources: [
          "'self'",
          'https://www.googletagmanager.com',
          'https://pagead2.googlesyndication.com',
          'https://vercel.live',
        ],
      },
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://pagead2.googlesyndication.com https://astro.badg.es",
        "connect-src 'self' https://www.google-analytics.com https://pagead2.googlesyndication.com",
        'frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com',
      ],
    },
  },
  integrations: [
    db(),
    icon(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
  ],
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
      ASTRO_DB_REMOTE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      ASTRO_DB_APP_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
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
