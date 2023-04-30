import axios from "axios";

export const axiosInstance = axios.create();

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
  localRemove("userID");
};

export const localSave = (name: string, isAdmin: number, id: number) => {
  localSet("name", name);
  localSet("role", isAdmin.toString());
  localSet("userID", id.toString());
};

export const checkUser = (needRole: string, nav: (url: string) => void) => {
  if (needRole !== localGet("role")) {
    nav("/login");
  }
};
