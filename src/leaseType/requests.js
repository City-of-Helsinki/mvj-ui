// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchLeaseTypes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease_type/?limit=10000')));
};
