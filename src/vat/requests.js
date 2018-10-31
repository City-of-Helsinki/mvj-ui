// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchVats = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`vat/?limit=10000`)));
};
