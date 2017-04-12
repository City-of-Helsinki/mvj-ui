// @flow

/* global API_URL */

const stringifyQuery = (query: {[key: string]: any}) =>
  Object
    .keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join('='))
    .join('&');

export default (url: string, params?: Object) =>
  // $FlowFixMe
  `${API_URL}/${url}${params ? `?${stringifyQuery(params)}` : ''}`;
