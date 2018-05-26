// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {RentForPeriodOptions} from './types';

export const fetchRentForPeriod = (payload: RentForPeriodOptions): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${payload.leaseId}/rent_for_period/?start_date=${payload.startDate}&end_date=${payload.endDate}`)));
};
