// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {RentForPeriodOptions} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_rent_for_period/`), {method: 'OPTIONS'}));
};

export const fetchRentForPeriod = (payload: RentForPeriodOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_rent_for_period/?lease=${payload.leaseId}&start_date=${payload.startDate}&end_date=${payload.endDate}`)));
};
