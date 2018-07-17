// @flow
import {createAction} from 'redux-actions';
import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  FetchInfillDevelopmentListAction,
  FetchSingleInfillDevelopmentAction,
  InfillDevelopment,
  InfillDevelopmentFileData,
  InfillDevelopmentId,
  InfillDevelopmentList,
  ReceiveInfillDevelopmentListAction,
  ReceiveSingleInfillDevelopmentAction,
  CreateInfillDevelopmentAction,
  EditInfillDevelopmentAction,
  UploadInfillDevelopmentFileAction,
  InfillDevelopmentNotFoundAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveIsSaveClickedAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
  ReceiveFormInitialValuesAction,
} from './types';

export const fetchInfillDevelopmentAttributes = (): FetchAttributesAction =>
  createAction('mvj/infillDevelopment/FETCH_ATTRIBUTES')();

export const receiveInfillDevelopmentAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/infillDevelopment/RECEIVE_ATTRIBUTES')(attributes);

export const fetchInfillDevelopments = (search: string): FetchInfillDevelopmentListAction =>
  createAction('mvj/infillDevelopment/FETCH_ALL')(search);

export const receiveInfillDevelopments= (infillDevelopments: InfillDevelopmentList): ReceiveInfillDevelopmentListAction =>
  createAction('mvj/infillDevelopment/RECEIVE_ALL')(infillDevelopments);

export const fetchSingleInfillDevelopment = (id: InfillDevelopmentId): FetchSingleInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/FETCH_SINGLE')(id);

export const receiveSingleInfillDevelopment = (infillDevelopment: InfillDevelopment): ReceiveSingleInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/RECEIVE_SINGLE')(infillDevelopment);

export const createInfillDevelopment = (infillDevelopment: InfillDevelopment): CreateInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/CREATE')(infillDevelopment);

export const editInfillDevelopment = (infillDevelopment: InfillDevelopment): EditInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/EDIT')(infillDevelopment);

export const uploadInfillDevelopmentFile = (data: InfillDevelopmentFileData): UploadInfillDevelopmentFileAction =>
  createAction('mvj/infillDevelopment/UPLOAD_FILE')(data);

export const notFound = (): InfillDevelopmentNotFoundAction =>
  createAction('mvj/infillDevelopment/NOT_FOUND')();

export const receiveFormInitialValues = (infillDevelopment: InfillDevelopment): ReceiveFormInitialValuesAction =>
  createAction('mvj/infillDevelopment/RECEIVE_INITIAL_VALUES')(infillDevelopment);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/infillDevelopment/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/infillDevelopment/SHOW_EDIT')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/infillDevelopment/RECEIVE_SAVE_CLICKED')(isClicked);

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/infillDevelopment/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/infillDevelopment/CLEAR_FORM_VALID_FLAGS')();
