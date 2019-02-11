// @flow
import type {Action} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type RentForPeriodId = number;

export type RentForPeriodState = {
  byLease: Object,
  isFetching: boolean,
  isSaveClicked: boolean,
};

export type FetchRentForPeriodPayload= {
  id: RentForPeriodId,
  allowDelete: boolean,
  leaseId: LeaseId,
  type: 'year' | 'range' | 'billing_period',
  startDate: string,
  endDate: string,
}

export type DeleteRentForPeriodPayload = {
  id: RentForPeriodId,
  leaseId: LeaseId,
}

export type RentForPeriod = Object;

export type FetchRentForPeriodAction = Action<'mvj/rentforperiod/FETCH_ALL', FetchRentForPeriodPayload>;
export type ReceiveRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/RECEIVE_BY_LEASE', RentForPeriod>;
export type DeleteRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/DELETE_BY_LEASE', DeleteRentForPeriodPayload>;
export type RentForPeriodNotFoundAction = Action<'mvj/rentforperiod/NOT_FOUND', void>;
export type ReceiveIsSaveClickedAction = Action<'mvj/rentforperiod/RECEIVE_SAVE_CLICKED', boolean>;
