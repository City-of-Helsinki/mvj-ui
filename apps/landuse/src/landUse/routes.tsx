export const Routes = {
  LIST: "list",
  CALLBACK: "callback",
  DETAIL: "detail",
} as const;

export const getRouteById = (id: string): string => {
  const routes = {
    [Routes.LIST]: "/",
    [Routes.CALLBACK]: "/callback",
    [Routes.DETAIL]: "/:id",
  };

  return routes[id] ? routes[id] : "";
};
