// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {FetchRentForPeriodPayload} from './types';

export const fetchRentForPeriod = (payload: FetchRentForPeriodPayload): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_rent_for_period/?lease=${payload.leaseId}&start_date=${payload.startDate}&end_date=${payload.endDate}`)));
};
