export type SiteConfig = {
  author: string;
  title: string;
  description: string;
  lang: string;
  ogLocale: string;
  date: {
    locale: string | string[] | undefined;
    options: Intl.DateTimeFormatOptions;
  };
  adsense: {
    clientId: string;
    adSlot: string;
  };
};

export type PaginationLink = {
  url: string;
  text?: string;
  srLabel?: string;
};

export type SiteMeta = {
  title?: string | undefined;
  description?: string | undefined;
  ogImage?: string | undefined;
  articleDate?: string | undefined;
};

export type Author = {
  type: string;
  name: string;
  photo: string;
  url: string;
};

export type Content = {
  'content-type': string;
  value: string;
  html: string;
  text: string;
};

export type Rels = {
  canonical: string;
};

export type Summary = {
  'content-type': string;
  value: string;
};
