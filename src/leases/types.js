// @flow

import type {Action, Attributes} from '../types';

export type LeaseState = {
  attributes: Attributes,
  byId: Array<Lease>,
  collapseStates: Object,
  current: Lease,
  isArchiveAreaModalOpen: boolean,
  isSaving: boolean,
  isFormValidById: Object,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingById: Array<boolean>,
  isFetchingAttributes: boolean,
  isSaveClicked: boolean,
  isUnarchiveAreaModalOpen: boolean,
  list: LeaseList,
};

export type Lease = Object;
export type LeaseList = Object;
export type LeaseId = number;
export type CreateRelatedLeasePayload = {
  from_lease: LeaseId,
  to_lease: LeaseId,
}
export type CreateChargePayload = {
  leaseId: LeaseId,
  data: Object,
}
export type DeleteRelatedLeasePayload = {
  id: number,
  leaseId: number,
}

export type FetchSingleLeaseAfterEditPayload = {
  leaseId: LeaseId,
  callbackFuntions?: Array<Object | Function>,
}

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;
export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeaseList>;
export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type FetchSingleLeaseAfterEditAction = Action<'mvj/leases/FETCH_SINGLE_AFTER_EDIT', FetchSingleLeaseAfterEditPayload>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;
export type FetchLeaseByIdAction = Action<'mvj/leases/FETCH_BY_ID', LeaseId>;
export type ReceiveLeaseByIdAction = Action<'mvj/leases/RECEIVE_BY_ID', Lease>;
export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;
export type ArchiveLeaseAreaAction = Action<'mvj/leases/ARCHIVE_AREA', Lease>;
export type UnarchiveLeaseAreaAction = Action<'mvj/leases/UNARCHIVE_AREA', Lease>;
export type StartInvoicingAction = Action<'mvj/leases/START_INVOICING', LeaseId>;
export type StopInvoicingAction = Action<'mvj/leases/STOP_INVOICING', LeaseId>;
export type SetRentInfoCompleteAction = Action<'mvj/leases/SET_RENT_INFO_COMPLETE', LeaseId>;
export type SetRentInfoUncompleteAction = Action<'mvj/leases/SET_RENT_INFO_UNCOMPLETE', LeaseId>;
export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;
export type LeaseNotFoundByIdAction = Action<'mvj/leases/NOT_FOUND_BY_ID', LeaseId>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/leases/RECEIVE_SAVE_CLICKED', boolean>;

export type CreateRelatedLeaseAction = Action<'mvj/leases/CREATE_RELATED_LEASE', CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<'mvj/leases/DELETE_RELATED_LEASE', DeleteRelatedLeasePayload>;

export type CopyAreasToContractAction = Action<'mvj/leases/COPY_AREAS_TO_CONTRACT', LeaseId>;

export type CreateChargeAction = Action<'mvj/leases/CREATE_CHARGE', CreateChargePayload>;

export type ReceiveFormValidFlagsAction = Action<'mvj/leases/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/leases/RECEIVE_COLLAPSE_STATES', Object>;

export type HideArchiveAreaModalAction = Action<'mvj/leases/HIDE_ARCHIVE_AREA_MODAL', void>;
export type ShowArchiveAreaModalAction = Action<'mvj/leases/SHOW_ARCHIVE_AREA_MODAL', void>;
export type HideUnarchiveAreaModalAction = Action<'mvj/leases/HIDE_UNARCHIVE_AREA_MODAL', void>;
export type ShowUnarchiveAreaModalAction = Action<'mvj/leases/SHOW_UNARCHIVE_AREA_MODAL', void>;
