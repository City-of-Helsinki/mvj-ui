// @flow

export const stringifyQuery = (query: {[key: string]: any}) =>
  Object
    .keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join('='))
    .join('&');

export default (url: string, params?: Object) =>
  `${process.env.API_URL || ''}/${url}${params ? `?${stringifyQuery(params)}` : ''}`;
