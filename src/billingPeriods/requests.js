// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {BillingPeriodsOptions} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_billing_periods/`), {method: 'OPTIONS'}));
};

export const fetchBillingPeriods = (payload: BillingPeriodsOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_billing_periods/?lease=${payload.leaseId}&year=${payload.year}`)));
};
