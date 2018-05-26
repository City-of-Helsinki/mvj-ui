// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {BillingPeriodsOptions} from './types';

export const fetchBillingPeriods = (payload: BillingPeriodsOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${payload.leaseId}/billing_periods/?year=${payload.year}`)));
};
