// @flow

import type {Action} from '../types';

export type LeaseState = Object;

export type Lease = Object;
export type Identifiers = Object;

export type FetchIdentifiersAction = Action<'mvj/lease/FETCH_IDENTIFIERS', void>;
export type ReceiveIdentifiersAction = Action<'mvj/lease/RECEIVE_IDENTIFIERS', Identifiers>;
