let navigate: ((path: string) => void) | null = null;

export const setNavigate = (navFn: (path: string) => void) => {
  navigate = navFn;
};

export const navigateTo = (path: string) => {
  if (navigate) navigate(path);
};
