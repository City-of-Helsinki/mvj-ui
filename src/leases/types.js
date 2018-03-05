// @flow

import type {Action} from '../types';

export type LeaseState = Object;

export type Lease = Object;
export type LeaseId = number;
export type Attributes = Object;

export type LeasesList = Array<any>;
export type Invoices = Array<any>;
export type Areas = Array<any>;

export type FetchAttributesAction = Action<'mvj/leasesbeta/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leasesbeta/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchInvoicesAction = Action<'mvj/leasesbeta/FETCH_INVOICES', LeaseId>;
export type ReceiveInvoicesAction = Action<'mvj/leasesbeta/RECEIVE_INVOICES', Invoices>;

export type FetchAreasAction = Action<'mvj/leasesbeta/FETCH_AREAS', void>;
export type ReceiveAreasAction = Action<'mvj/leasesbeta/RECEIVE_AREAS', Areas>;

export type FetchLeasesAction = Action<'mvj/leasesbeta/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leasesbeta/RECEIVE_ALL', LeasesList>;

export type FetchSingleLeaseAction = Action<'mvj/leasesbeta/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leasesbeta/RECEIVE_SINGLE', Lease>;

export type CreateLeaseAction = Action<'mvj/leasesbeta/CREATE', Lease>;
export type EditLeaseAction = Action<'mvj/leasesbeta/EDIT', Lease>;

export type LeaseNotFoundAction = Action<'mvj/leasesbeta/NOT_FOUND', void>;

export type HideEditModeAction = Action<'mvj/leasesbeta/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leasesbeta/SHOW_EDIT', void>;
