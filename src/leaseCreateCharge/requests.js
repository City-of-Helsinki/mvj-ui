// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_create_charge/`), {method: 'OPTIONS'}));
};

export const fetchReceivableTypes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`receivable_type/`), {method: 'GET'}));
};
