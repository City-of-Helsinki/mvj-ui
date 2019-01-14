// @flow

import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';

export type DecisionState = {
  byLease: DecisionListMap,
  isFetching: boolean,
};
export type DecisionList = Array<Object>;
export type DecisionListMap = {[key: number]: DecisionList};

export type FetchDecisionsByLeaseAction = Action<'mvj/decision/FETCH_BY_LEASE', LeaseId>;
export type ReceiveDecisionsByLeaseAction = Action<'mvj/decision/RECEIVE_BY_LEASE', Object>;
export type DecisionNotFoundAction = Action<'mvj/decision/NOT_FOUND', void>;
