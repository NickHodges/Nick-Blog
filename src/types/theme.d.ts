// Add this to your src/env.d.ts file or create a separate type definition file
interface Window {
  themeUtils?: {
    getTheme: () => string | null;
    setTheme: (theme: string, syncWithOS?: boolean) => void;
    isSyncingWithOS: () => boolean;
    toggleSyncWithOS: () => boolean;
  };
}
