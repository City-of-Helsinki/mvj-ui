// @flow
export const getRedirectUrlFromSessionStorage = () => {
  return sessionStorage.getItem('redirectURL');
};

export const setRedirectUrlToSessionStorage = (url: string) => {
  sessionStorage.setItem('redirectURL', url);
};
