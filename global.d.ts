// allow imports of image assets in TypeScript
// this file is automatically picked up by the compiler

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// Vite specific import.meta extensions
interface ImportMeta {
  readonly env: {
    readonly VITE_TRIP_REQUEST_WEB_APP_URL?: string;
  };
  readonly glob: (
    glob: string,
    options?: { eager?: boolean; as?: 'url' | 'raw' | 'default' }
  ) => Record<string, string>;
}
