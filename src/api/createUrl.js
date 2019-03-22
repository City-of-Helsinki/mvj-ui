// @flow
import isArray from 'lodash/isArray';

export const stringifyQuery = (query: {[key: string]: any}) =>
  Object
    .keys(query)
    .map((key) => [key, query[key]].map((v) => encodeURIComponent(v)).join('='))
    .join('&');

export const standardStringifyQuery = (query: {[key: string]: any}) =>
  Object
    .keys(query)
    .map((key) => isArray(query[key])
      ? [key, query[key].map((v) => encodeURIComponent(v)).join(`&${key}=`)].join('=')
      : [key, query[key]].map((v) => encodeURIComponent(v)).join('=')
    )
    .join('&');

export default (url: string, params?: Object) =>
  `${process.env.API_URL || ''}/${url}${params ? `?${stringifyQuery(params)}` : ''}`;
