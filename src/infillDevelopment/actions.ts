import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  InfillDevelopmentAttributesNotFoundAction,
  FetchInfillDevelopmentListAction,
  FetchSingleInfillDevelopmentAction,
  InfillDevelopment,
  InfillDevelopmentId,
  InfillDevelopmentList,
  ReceiveInfillDevelopmentListAction,
  ReceiveSingleInfillDevelopmentAction,
  CreateInfillDevelopmentAction,
  EditInfillDevelopmentAction,
  InfillDevelopmentNotFoundAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveIsSaveClickedAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
  ReceiveFormInitialValuesAction,
  ReceiveCollapseStatesAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/infillDevelopment/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/infillDevelopment/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/infillDevelopment/RECEIVE_METHODS")(methods);
export const attributesNotFound =
  (): InfillDevelopmentAttributesNotFoundAction =>
    createAction("mvj/infillDevelopment/ATTRIBUTES_NOT_FOUND")();
export const fetchInfillDevelopments = (
  query: Record<string, any>,
): FetchInfillDevelopmentListAction =>
  createAction("mvj/infillDevelopment/FETCH_ALL")(query);
export const receiveInfillDevelopments = (
  infillDevelopments: InfillDevelopmentList,
): ReceiveInfillDevelopmentListAction =>
  createAction("mvj/infillDevelopment/RECEIVE_ALL")(infillDevelopments);
export const fetchSingleInfillDevelopment = (
  id: InfillDevelopmentId,
): FetchSingleInfillDevelopmentAction =>
  createAction("mvj/infillDevelopment/FETCH_SINGLE")(id);
export const receiveSingleInfillDevelopment = (
  infillDevelopment: InfillDevelopment,
): ReceiveSingleInfillDevelopmentAction =>
  createAction("mvj/infillDevelopment/RECEIVE_SINGLE")(infillDevelopment);
export const createInfillDevelopment = (
  infillDevelopment: InfillDevelopment,
): CreateInfillDevelopmentAction =>
  createAction("mvj/infillDevelopment/CREATE")(infillDevelopment);
export const editInfillDevelopment = (
  infillDevelopment: InfillDevelopment,
): EditInfillDevelopmentAction =>
  createAction("mvj/infillDevelopment/EDIT")(infillDevelopment);
export const notFound = (): InfillDevelopmentNotFoundAction =>
  createAction("mvj/infillDevelopment/NOT_FOUND")();
export const receiveFormInitialValues = (
  infillDevelopment: InfillDevelopment,
): ReceiveFormInitialValuesAction =>
  createAction("mvj/infillDevelopment/RECEIVE_INITIAL_VALUES")(
    infillDevelopment,
  );
export const hideEditMode = (): HideEditModeAction =>
  createAction("mvj/infillDevelopment/HIDE_EDIT")();
export const showEditMode = (): ShowEditModeAction =>
  createAction("mvj/infillDevelopment/SHOW_EDIT")();
export const receiveIsSaveClicked = (
  isClicked: boolean,
): ReceiveIsSaveClickedAction =>
  createAction("mvj/infillDevelopment/RECEIVE_SAVE_CLICKED")(isClicked);
export const receiveFormValidFlags = (
  valid: Record<string, any>,
): ReceiveFormValidFlagsAction =>
  createAction("mvj/infillDevelopment/RECEIVE_FORM_VALID_FLAGS")(valid);
export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction("mvj/infillDevelopment/CLEAR_FORM_VALID_FLAGS")();
export const receiveCollapseStates = (
  status: Record<string, any>,
): ReceiveCollapseStatesAction =>
  createAction("mvj/infillDevelopment/RECEIVE_COLLAPSE_STATES")(status);
