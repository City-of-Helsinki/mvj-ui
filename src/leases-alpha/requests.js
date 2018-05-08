// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {LeaseId, Lease} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchAreas = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area/')));
};

export const fetchLeases = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/')));
};

export const fetchInvoices = (lease: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl('invoice', {lease})));
};

export const fetchSingleLease = (id: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${id}`)));
};

export const createLease = (lease: Lease): Generator<any, any, any> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const editLease = (lease: Lease): Generator<any, any, any> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PUT',
    body,
  }));
};
