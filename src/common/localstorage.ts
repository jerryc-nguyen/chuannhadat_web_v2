export const saveToStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.setItem(key, value);
  }
};

// get from storage
export const getFromStorage = (key: string) => {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.removeItem(key);
  }
};
