// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchIndexList = (query: Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('index/', query)));
};
