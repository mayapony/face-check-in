export const localSet = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const localGet = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const localRemove = (key: string) => {
  localStorage.removeItem(key);
};

export const localClear = () => {
  localRemove("role");
  localRemove("name");
};
