// @flow
import {getApiUrlWithOutVersionSuffix} from '$src/util/helpers';
import {stringifyQuery} from './createUrl';

export default (url: string, params?: Object) => {
  const apiUrlWithOutVersionSuffix = getApiUrlWithOutVersionSuffix();

  return `${apiUrlWithOutVersionSuffix}/${url}${params ? `?${stringifyQuery(params)}` : ''}`;
};
