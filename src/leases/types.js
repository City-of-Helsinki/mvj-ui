// @flow

import type {Action} from '../types';

export type LeaseState = Object;

export type Lease = Object;
export type LeaseId = number;
export type Identifiers = Object;

export type FetchIdentifiersAction = Action<'mvj/leases/FETCH_IDENTIFIERS', void>;
export type ReceiveIdentifiersAction = Action<'mvj/leases/RECEIVE_IDENTIFIERS', Identifiers>;

export type LeasesList = Array<any>;

export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', void>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeasesList>;

export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;

export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type EditLeaseAction = Action<'mvj/leases/EDIT', Lease>;

export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;
