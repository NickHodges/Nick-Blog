import type { SiteConfig } from '@types';

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: 'Nick Hodges',
  // Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
  title: 'Nick Hodges',
  // Meta property used as the default description meta property
  description: 'The Personal Website of Nick Hodges',
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: 'en-US',
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: 'en_US',
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: 'en-US',
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  // Google AdSense Configuration
  adsense: {
    clientId: 'ca-pub-9957327027530940', // Replace with your AdSense publisher ID
    adSlot: '6617379235', // Replace with your ad slot ID
  },
};

// Used to generate links in both the Header & Footer.
export const menuLinks: Array<{ title: string; path: string }> = [
  {
    title: 'About',
    path: '/about/',
  },
  {
    title: 'Blog',
    path: '/posts/',
  },
  {
    title: 'Support Me',
    path: '/info/support/',
  },
  {
    title: 'Now',
    path: '/now/',
  },
];

// Legal page links shown in the footer.
export const legalLinks: Array<{ title: string; path: string }> = [
  {
    title: 'Privacy Policy',
    path: '/info/privacy-policy/',
  },
  {
    title: 'Terms of Service',
    path: '/info/terms-of-service/',
  },
  {
    title: 'Disclaimer',
    path: '/info/disclaimer/',
  },
];

