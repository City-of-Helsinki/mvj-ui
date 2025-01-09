import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  ClearFormValidFlagsAction,
  CopyAreasToContractAction,
  CopyDecisionToLeasesAction,
  CreateChargeAction,
  CreateChargePayload,
  CreateLeaseAction,
  CreateLeaseAndUpdateCurrentLeaseAction,
  DeleteLeaseAction,
  FetchAttributesAction,
  FetchLeaseByIdAction,
  FetchLeasesAction,
  FetchLeasesByBBoxAction,
  FetchSingleLeaseAction,
  FetchSingleLeaseAfterEditAction,
  FetchSingleLeaseAfterEditPayload,
  HideAttachDecisionModalAction,
  HideCreateModalAction,
  HideEditModeAction,
  Lease,
  LeaseAttributesNotFoundAction,
  LeaseId,
  LeaseList,
  LeaseNotFoundAction,
  LeaseNotFoundByIdAction,
  NotFoundByBBoxAction,
  PatchLeaseAction,
  PatchLeaseInvoiceNotesAction,
  ReceiveAttributesAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveLeaseByIdAction,
  ReceiveLeasesAction,
  ReceiveLeasesByBBoxAction,
  ReceiveMethodsAction,
  ReceiveSingleLeaseAction,
  SendEmailAction,
  SendEmailPayload,
  SetRentInfoCompleteAction,
  SetRentInfoUncompleteAction,
  ShowAttachDecisionModalAction,
  ShowCreateModalAction,
  ShowEditModeAction,
  StartInvoicingAction,
  StopInvoicingAction,
  FetchLeasesForContractNumberAction,
  ReceiveLeasesForContractNumbersAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/leases/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/leases/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/leases/RECEIVE_METHODS")(methods);
export const fetchLeases = (params: Record<string, any>): FetchLeasesAction =>
  createAction("mvj/leases/FETCH_ALL")(params);
export const fetchLeasesByBBox = (
  params: Record<string, any>,
): FetchLeasesByBBoxAction => createAction("mvj/leases/FETCH_BY_BBOX")(params);
export const receiveLeases = (leases: LeaseList): ReceiveLeasesAction =>
  createAction("mvj/leases/RECEIVE_ALL")(leases);
export const receiveLeasesByBBox = (
  leases: LeaseList,
): ReceiveLeasesByBBoxAction =>
  createAction("mvj/leases/RECEIVE_BY_BBOX")(leases);
export const fetchSingleLease = (id: LeaseId): FetchSingleLeaseAction =>
  createAction("mvj/leases/FETCH_SINGLE")(id);
export const fetchSingleLeaseAfterEdit = (
  payload: FetchSingleLeaseAfterEditPayload,
): FetchSingleLeaseAfterEditAction =>
  createAction("mvj/leases/FETCH_SINGLE_AFTER_EDIT")(payload);
export const receiveSingleLease = (lease: Lease): ReceiveSingleLeaseAction =>
  createAction("mvj/leases/RECEIVE_SINGLE")(lease);
export const fetchLeaseById = (id: LeaseId): FetchLeaseByIdAction =>
  createAction("mvj/leases/FETCH_BY_ID")(id);
export const receiveLeaseById = (lease: Lease): ReceiveLeaseByIdAction =>
  createAction("mvj/leases/RECEIVE_BY_ID")(lease);
export const createLease = (lease: Lease): CreateLeaseAction =>
  createAction("mvj/leases/CREATE")(lease);
export const createLeaseAndUpdateCurrentLease = (
  lease: Lease,
): CreateLeaseAndUpdateCurrentLeaseAction =>
  createAction("mvj/leases/CREATE_AND_UPDATE")(lease);
export const deleteLease = (leaseId: LeaseId): DeleteLeaseAction =>
  createAction("mvj/leases/DELETE")(leaseId);
export const patchLease = (lease: Lease): PatchLeaseAction =>
  createAction("mvj/leases/PATCH")(lease);
export const patchLeaseInvoiceNotes = (
  lease: Lease,
): PatchLeaseInvoiceNotesAction =>
  createAction("mvj/leases/PATCH_INVOICE_NOTES")(lease);
export const startInvoicing = (id: LeaseId): StartInvoicingAction =>
  createAction("mvj/leases/START_INVOICING")(id);
export const stopInvoicing = (id: LeaseId): StopInvoicingAction =>
  createAction("mvj/leases/STOP_INVOICING")(id);
export const setRentInfoComplete = (
  leaseId: LeaseId,
): SetRentInfoCompleteAction =>
  createAction("mvj/leases/SET_RENT_INFO_COMPLETE")(leaseId);
export const setRentInfoUncomplete = (
  leaseId: LeaseId,
): SetRentInfoUncompleteAction =>
  createAction("mvj/leases/SET_RENT_INFO_UNCOMPLETE")(leaseId);
export const attributesNotFound = (): LeaseAttributesNotFoundAction =>
  createAction("mvj/leases/ATTRIBUTES_NOT_FOUND")();
export const sendEmail = (payload: SendEmailPayload): SendEmailAction =>
  createAction("mvj/leases/SEND_EMAIL")(payload);
export const notFound = (): LeaseNotFoundAction =>
  createAction("mvj/leases/NOT_FOUND")();
export const notFoundByBBox = (): NotFoundByBBoxAction =>
  createAction("mvj/leases/NOT_FOUND_BY_BBOX")();
export const notFoundById = (id: LeaseId): LeaseNotFoundByIdAction =>
  createAction("mvj/leases/NOT_FOUND_BY_ID")(id);
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/leases/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/leases/SHOW_EDIT")();
export const copyAreasToContract = (
  leaseId: LeaseId,
): CopyAreasToContractAction =>
  createAction("mvj/leases/COPY_AREAS_TO_CONTRACT")(leaseId);
export const copyDecisionToLeases = (
  payload: Record<string, any>,
): CopyDecisionToLeasesAction =>
  createAction("mvj/leases/COPY_DECISION_TO_LEASES")(payload);
export const hideAttachDecisionModal = (): HideAttachDecisionModalAction =>
  createAction("mvj/leases/HIDE_ATTACH_DECISION_MODAL")();
export const showAttachDecisionModal = (): ShowAttachDecisionModalAction =>
  createAction("mvj/leases/SHOW_ATTACH_DECISION_MODAL")();
export const hideCreateModal = (): HideCreateModalAction =>
  createAction("mvj/leases/HIDE_CREATE_MODAL")();
export const showCreateModal = (): ShowCreateModalAction =>
  createAction("mvj/leases/SHOW_CREATE_MODAL")();
export const receiveFormValidFlags = (
  valid: Record<string, any>,
): ReceiveFormValidFlagsAction =>
  createAction("mvj/leases/RECEIVE_FORM_VALID_FLAGS")(valid);
export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction("mvj/leases/CLEAR_FORM_VALID_FLAGS")();
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/leases/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/leases/RECEIVE_COLLAPSE_STATES")(status);
export const createCharge = (
  payload: CreateChargePayload,
): CreateChargeAction => createAction("mvj/leases/CREATE_CHARGE")(payload);
export const fetchLeasesForContractNumber = (
  params: Record<string, any>,
): FetchLeasesForContractNumberAction =>
  createAction("mvj/leases/FETCH_LEASES_FOR_CONTRACT_NUMBERS")(params);
export const receiveLeasesForContractNumbers = (
  leases: LeaseList,
): ReceiveLeasesForContractNumbersAction =>
  createAction("mvj/leases/RECEIVE_LEASES_FOR_CONTRACT_NUMBERS")(leases);
