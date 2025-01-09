import isArray from "lodash/isArray";
export const stringifyQuery = (query: Record<string, any>): string =>
  Object.keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join("="))
    .join("&");
export const standardStringifyQuery = (query: Record<string, any>): string =>
  Object.keys(query)
    .map((key) =>
      isArray(query[key])
        ? [
            key,
            query[key].map((v) => encodeURIComponent(v)).join(`&${key}=`),
          ].join("=")
        : [key, query[key]].map((v) => encodeURIComponent(v)).join("="),
    )
    .join("&");
export default (url: string, params?: Record<string, any>): string =>
  `${import.meta.env.VITE_API_URL || ""}/${url}${params ? `?${stringifyQuery(params)}` : ""}`;
