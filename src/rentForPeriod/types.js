// @flow
import PropTypes from 'prop-types';

import type {Action, Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/leases/types';
import {RentCalculatorTypes} from '$components/enums';

const RentCalculatorType = PropTypes.oneOf([
  RentCalculatorTypes.YEAR,
  RentCalculatorTypes.RANGE,
  RentCalculatorTypes.BILLING_PERIOD,
]);

export type RentForPeriodId = number;

export type RentForPeriodState = {
  attributes: Attributes,
  byLease: Object,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  isSaveClicked: boolean,
  methods: Methods,
};

export type RentForPeriodOptions = {
  id: RentForPeriodId,
  allowDelete: boolean,
  leaseId: LeaseId,
  type: RentCalculatorType,
  startDate: string,
  endDate: string,
}

export type RentForPeriodDeleteOptions = {
  id: RentForPeriodId,
  leaseId: LeaseId,
}

export type RentForPeriod = Object;

export type FetchAttributesAction = Action<'mvj/rentforperiod/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/rentforperiod/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/rentforperiod/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/rentforperiod/ATTRIBUTES_NOT_FOUND', void>;

export type FetchRentForPeriodAction = Action<'mvj/rentforperiod/FETCH_ALL', RentForPeriodOptions>;
export type ReceiveRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/RECEIVE_BY_LEASE', RentForPeriod>;
export type DeleteRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/DELETE_BY_LEASE', RentForPeriodDeleteOptions>;
export type RentForPeriodNotFoundAction = Action<'mvj/rentforperiod/NOT_FOUND', void>;
export type ReceiveIsSaveClickedAction = Action<'mvj/rentforperiod/RECEIVE_SAVE_CLICKED', boolean>;
