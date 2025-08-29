interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }
  
  declare const window: Window;