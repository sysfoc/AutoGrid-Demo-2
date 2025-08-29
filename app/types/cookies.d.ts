// types.d.ts or global.d.ts
export {};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
