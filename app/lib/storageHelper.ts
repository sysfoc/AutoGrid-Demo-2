export const getLocalStorage = (key: string, defaultValue: unknown) => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = window.localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn(`Error parsing localStorage item "${key}":`, e);
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};
