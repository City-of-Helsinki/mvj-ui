// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {LeaseId, Lease} from './types';

export const fetchAttributes = () => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = (search: string): Generator<> => {
  return callApi(new Request(createUrl(`lease/${search}`)));
};

export const fetchSingleLease = (id: LeaseId): Generator<> => {
  return callApi(new Request(createUrl(`lease/${id}`)));
};

export const createLease = (lease: Lease): Generator<> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const editLease = (lease: Lease): Generator<> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PUT',
    body,
  }));
};
