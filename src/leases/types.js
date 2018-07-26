// @flow

import type {Action} from '../types';
import type {Contact} from '$src/contacts/types';

export type LeaseState = Object;

export type ContactModalSettings = Object | null;

export type Attributes = Object;
export type Lease = Object;
export type LeaseList = Object;
export type LeaseId = number;
export type CreateRelatedLeasePayload = {
  from_lease: LeaseId,
  to_lease: LeaseId,
}
export type DeleteRelatedLeasePayload = {
  id: number,
  leaseId: number,
}

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;
export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeaseList>;
export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;
export type FetchLeaseByIdAction = Action<'mvj/leases/FETCH_BY_ID', LeaseId>;
export type ReceiveLeaseByIdAction = Action<'mvj/leases/RECEIVE_BY_ID', Lease>;
export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;
export type StartInvoicingAction = Action<'mvj/leases/START_INVOICING', LeaseId>;
export type StopInvoicingAction = Action<'mvj/leases/STOP_INVOICING', LeaseId>;
export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;
export type LeaseNotFoundByIdAction = Action<'mvj/leases/NOT_FOUND_BY_ID', LeaseId>;

export type HideContactModalAction = Action<'mvj/leases/HIDE_CONTACT_MODAL', void>;
export type ShowContactModalAction = Action<'mvj/leases/SHOW_CONTACT_MODAL', void>;
export type ReceiveContactModalSettingsAction = Action<'mvj/leases/RECEIVE_CONTACT_SETTINGS', ContactModalSettings>;
export type CreateContactAction = Action<'mvj/leases/CREATE_CONTACT', Contact>;
export type EditContactAction = Action<'mvj/leases/EDIT_CONTACT', Contact>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/leases/RECEIVE_SAVE_CLICKED', boolean>;

export type CreateRelatedLeaseAction = Action<'mvj/leases/CREATE_RELATED_LEASE', CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<'mvj/leases/DELETE_RELATED_LEASE', DeleteRelatedLeasePayload>;
export type HideDeleteRelatedLeaseModalAction = Action<'mvj/leases/HIDE_RELATED_LEASE_MODAL', void>;
export type ShowDeleteRelatedLeaseModalAction = Action<'mvj/leases/SHOW_RELATED_LEASE_MODAL', void>;

export type ReceiveFormValidFlagsAction = Action<'mvj/leases/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatusesAction = Action<'mvj/leases/RECEIVE_COLLAPSE_STATUSES', Object>;
