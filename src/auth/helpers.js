// @flow
import userManager from '$src/auth/util/user-manager';

export const clearUserAndSessionStorage = () => {
  userManager.removeUser();
  sessionStorage.clear();
};

export const getRedirectUrlFromSessionStorage = () => {
  return sessionStorage.getItem('redirectURL');
};

export const setRedirectUrlToSessionStorage = (url: string) => {
  sessionStorage.setItem('redirectURL', url);
};
