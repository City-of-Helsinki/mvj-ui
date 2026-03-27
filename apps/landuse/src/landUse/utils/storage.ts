const getSessionStorageItem = (key: string): string => {
  return sessionStorage.getItem(key) || "";
};

const setSessionStorageItem = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const getRedirectUrlFromSessionStorage = (): string => {
  return getSessionStorageItem("redirectURL");
};

export const setRedirectUrlToSessionStorage = (url: string) => {
  setSessionStorageItem("redirectURL", url);
};
