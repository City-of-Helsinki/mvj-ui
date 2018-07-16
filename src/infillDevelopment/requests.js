// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`infill_development_compensation/`), {method: 'OPTIONS'}));
};
