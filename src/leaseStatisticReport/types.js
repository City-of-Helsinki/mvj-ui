// @flow
import type {Action, Attributes} from '../types';

export type LeaseStatisticReportState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
};

export type FetchAttributesAction = Action<'mvj/leaseStatisticReport/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leaseStatisticReport/RECEIVE_ATTRIBUTES', Attributes>;
export type AttributesNotFoundAction = Action<'mvj/leaseStatisticReport/ATTRIBUTES_NOT_FOUND', void>;
