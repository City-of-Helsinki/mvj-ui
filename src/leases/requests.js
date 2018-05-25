// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {BillingPeriodsOptions, LeaseId, Lease, RentForPeriodOptions} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${search || ''}`)));
};

export const fetchSingleLease = (id: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${id}/`)));
};

export const fetchBillingPeriods = (payload: BillingPeriodsOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${payload.leaseId}/billing_periods/?year=${payload.year}`)));
};

export const fetchRentForPeriod = (payload: RentForPeriodOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${payload.leaseId}/rent_for_period/?start_date=${payload.startDate}&end_date=${payload.endDate}`)));
};

export const createLease = (lease: Lease): Generator<any, any, any> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const patchLease = (lease: Lease): Generator<any, any, any> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PATCH',
    body,
  }));
};
