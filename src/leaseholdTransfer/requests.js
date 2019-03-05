// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('leasehold_transfer/'), {method: 'OPTIONS'}));
};

export const fetchLeaseholdTransferList = (query?: Object) => {
  return callApi(new Request(createUrl('leasehold_transfer/', query)));
};
