// @flow
import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  LandUseContractId,
  LandUseContract,
  LandUseContractList,
  FetchLandUseContractListAction,
  ReceiveLandUseContractListAction,
  FetchSingleLandUseContractAction,
  ReceiveSingleLandUseContractAction,
  CreateLandUseContractAction,
  EditLandUseContractAction,
  LandUseContractNotFoundAction,
  ReceiveIsSaveClickedAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveFormValidFlagsAction,
  ClearFormValidFlagsAction,
} from './types';

export const fetchLandUseContractAttributes = (): FetchAttributesAction =>
  createAction('mvj/landUseContract/FETCH_ATTRIBUTES')();

export const receiveLandUseContractAttributes = (attributes: Attributes): ReceiveAttributesAction =>
  createAction('mvj/landUseContract/RECEIVE_ATTRIBUTES')(attributes);

export const fetchLandUseContractList = (search: string): FetchLandUseContractListAction =>
  createAction('mvj/landUseContract/FETCH_ALL')(search);

export const receiveLandUseContractList = (list: LandUseContractList): ReceiveLandUseContractListAction =>
  createAction('mvj/landUseContract/RECEIVE_ALL')(list);

export const fetchSingleLandUseContract = (id: LandUseContractId): FetchSingleLandUseContractAction =>
  createAction('mvj/landUseContract/FETCH_SINGLE')(id);

export const receiveSingleLandUseContract = (contract: LandUseContract): ReceiveSingleLandUseContractAction =>
  createAction('mvj/landUseContract/RECEIVE_SINGLE')(contract);

export const createLandUseContract = (landUseContract: LandUseContract): CreateLandUseContractAction =>
  createAction('mvj/landUseContract/CREATE')(landUseContract);

export const editLandUseContract = (landUseContract: LandUseContract): EditLandUseContractAction =>
  createAction('mvj/landUseContract/EDIT')(landUseContract);

export const notFound = (): LandUseContractNotFoundAction =>
  createAction('mvj/landUseContract/NOT_FOUND')();

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/landUseContract/RECEIVE_SAVE_CLICKED')(isClicked);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/landUseContract/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/landUseContract/SHOW_EDIT')();

export const receiveFormValidFlags = (valid: Object): ReceiveFormValidFlagsAction =>
  createAction('mvj/landUseContract/RECEIVE_FORM_VALID_FLAGS')(valid);

export const clearFormValidFlags = (): ClearFormValidFlagsAction =>
  createAction('mvj/landUseContract/CLEAR_FORM_VALID_FLAGS')();
