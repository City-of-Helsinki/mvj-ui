// @flow
import type {Action, Attributes, Methods} from '../types';
import type {LeaseId} from '$src/leases/types';

export type BillingPeriodState = {
  attributes: Attributes,
  byLease: Object,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  methods: Methods,
};
export type BillingPeriodsOptions = {
  leaseId: LeaseId,
  year: number,
}
export type BillingPeriodList = Array<Object>;

export type FetchAttributesAction = Action<'mvj/billingperiods/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/billingperiods/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/billingperiods/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/billingperiods/ATTRIBUTES_NOT_FOUND', void>;

export type FetchBillingPeriodsAction = Action<'mvj/billingperiods/FETCH_ALL', BillingPeriodsOptions>;
export type ReceiveBillingPeriodsAction = Action<'mvj/billingperiods/RECEIVE_ALL', Object>;
export type BillingPeriodsNotFoundAction = Action<'mvj/billingperiods/NOT_FOUND', void>;
