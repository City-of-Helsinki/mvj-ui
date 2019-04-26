// @flow
import type {Action, Attributes, Methods} from '../types';

export type LeaseState = {
  attributes: Attributes,
  byId: Object,
  collapseStates: Object,
  current: Lease,
  isAttachDecisionModalOpen: boolean,
  isCreateModalOpen: boolean,
  isFormValidById: Object,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingById: {},
  isFetchingAttributes: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  list: LeaseList,
  methods: Methods,
};

export type Lease = Object;
export type LeaseList = Object;
export type LeaseId = number;

export type CreateChargePayload = {
  leaseId: LeaseId,
  data: Object,
}

export type FetchSingleLeaseAfterEditPayload = {
  leaseId: LeaseId,
  callbackFuntions?: Array<Object | Function>,
}

export type SendEmailPayload = {
  type: string,
  lease: LeaseId,
  recipients: Array<number>,
  text: string,
}

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/leases/RECEIVE_METHODS', Methods>;
export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', Object>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeaseList>;
export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type FetchSingleLeaseAfterEditAction = Action<'mvj/leases/FETCH_SINGLE_AFTER_EDIT', FetchSingleLeaseAfterEditPayload>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;
export type FetchLeaseByIdAction = Action<'mvj/leases/FETCH_BY_ID', LeaseId>;
export type ReceiveLeaseByIdAction = Action<'mvj/leases/RECEIVE_BY_ID', Lease>;
export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type CreateLeaseAndUpdateCurrentLeaseAction = Action<'mvj/leases/CREATE_AND_UPDATE', Lease>;
export type DeleteLeaseAction = Action<'mvj/leases/DELETE', LeaseId>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;
export type PatchLeaseInvoiceNotesAction = Action<'mvj/leases/PATCH_INVOICE_NOTES', Lease>;
export type StartInvoicingAction = Action<'mvj/leases/START_INVOICING', LeaseId>;
export type StopInvoicingAction = Action<'mvj/leases/STOP_INVOICING', LeaseId>;
export type SetRentInfoCompleteAction = Action<'mvj/leases/SET_RENT_INFO_COMPLETE', LeaseId>;
export type SetRentInfoUncompleteAction = Action<'mvj/leases/SET_RENT_INFO_UNCOMPLETE', LeaseId>;
export type LeaseAttributesNotFoundAction = Action<'mvj/leases/ATTRIBUTES_NOT_FOUND', void>;
export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;
export type LeaseNotFoundByIdAction = Action<'mvj/leases/NOT_FOUND_BY_ID', LeaseId>;

export type SendEmailAction = Action<'mvj/leases/SEND_EMAIL', SendEmailPayload>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type HideCreateModalAction = Action<'mvj/leases/HIDE_CREATE_MODAL', void>;
export type ShowCreateModalAction = Action<'mvj/leases/SHOW_CREATE_MODAL', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/leases/RECEIVE_SAVE_CLICKED', boolean>;

export type CopyAreasToContractAction = Action<'mvj/leases/COPY_AREAS_TO_CONTRACT', LeaseId>;

export type CopyDecisionToLeasesAction = Action<'mvj/leases/COPY_DECISION_TO_LEASES', Object>;
export type HideAttachDecisionModalAction = Action<'mvj/leases/HIDE_ATTACH_DECISION_MODAL', void>;
export type ShowAttachDecisionModalAction = Action<'mvj/leases/SHOW_ATTACH_DECISION_MODAL', void>;

export type CreateChargeAction = Action<'mvj/leases/CREATE_CHARGE', CreateChargePayload>;

export type ReceiveFormValidFlagsAction = Action<'mvj/leases/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/leases/RECEIVE_COLLAPSE_STATES', Object>;
