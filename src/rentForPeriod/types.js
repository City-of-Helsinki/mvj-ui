// @flow
import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';

export type RentForPeriodState = Object;
export type RentForPeriodOptions = {
  leaseId: LeaseId,
  startDate: string,
  endDate: string,
}

export type RentForPeriod = Object;

export type FetchRentForPeriodAction = Action<'mvj/rentforperiod/FETCH_ALL', RentForPeriodOptions>;
export type ReceiveRentForPeriodAction = Action<'mvj/rentforperiod/RECEIVE_ALL', RentForPeriod>;
export type RentForPeriodNotFoundAction = Action<'mvj/rentforperiod/NOT_FOUND', void>;
