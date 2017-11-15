// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {LeaseId} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = () => {
  return callApi(new Request(createUrl('lease/')));
};

export const fetchSingleLease = (id: LeaseId): Generator<> => {
  return callApi(new Request(createUrl(`lease/${id}`)));
};
