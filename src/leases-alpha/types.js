// @flow

import type {Action} from '../types';

export type LeaseState = Object;

export type Lease = Object;
export type LeaseId = number;
export type Attributes = Object;

export type LeasesList = Array<any>;
export type Invoices = Array<any>;
export type Areas = Array<any>;

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchInvoicesAction = Action<'mvj/leases/FETCH_INVOICES', LeaseId>;
export type ReceiveInvoicesAction = Action<'mvj/leases/RECEIVE_INVOICES', Invoices>;

export type FetchAreasAction = Action<'mvj/leases/FETCH_AREAS', void>;
export type ReceiveAreasAction = Action<'mvj/leases/RECEIVE_AREAS', Areas>;

export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', void>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeasesList>;

export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;

export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type EditLeaseAction = Action<'mvj/leases/EDIT', Lease>;

export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;
