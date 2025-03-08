/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '@pagefind/default-ui' {
  declare class PagefindUI {
    constructor(arg: unknown);
  }
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  themeUtils?: {
    getTheme: () => string | null;
    setTheme: (theme: string, syncWithOS?: boolean) => void;
    isSyncingWithOS: () => boolean;
    toggleSyncWithOS: () => boolean;
  };
}
