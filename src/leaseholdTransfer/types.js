// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type LeaseholdTransferState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: LeaseholdTransferList,
  methods: Methods,
}

export type LeaseholdTransferList = Object;

export type FetchAttributesAction = Action<'mvj/leaseholdTransfer/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/leaseholdTransfer/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND', void>;

export type FetchLeaseholdTransferListAction = Action<'mvj/leaseholdTransfer/FETCH', ?Object>;
export type ReceiveLeaseholdTransferListAction = Action<'mvj/leaseholdTransfer/RECEIVE', LeaseholdTransferList>;
export type NotFoundAction = Action<'mvj/leaseholdTransfer/NOT_FOUND', void>;
