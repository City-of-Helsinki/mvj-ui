// @flow

import {createAction} from 'redux-actions';

import type {
  Attributes,
  FetchAttributesAction,
  ReceiveAttributesAction,
  RentBasisList,
  FetchRentBasisListAction,
  ReceiveRentBasisListAction,
  RentBasisId,
  RentBasis,
  FetchSingleRentBasisAction,
  ReceiveSingleRentBasisAction,
  CreateRentBasisAction,
  EditRentBasisAction,
  ReceiveIsSaveClickedAction,
  HideEditModeAction,
  ShowEditModeAction,
  ReceiveRentBasisInitialValuesAction,
  ReceiveFormValidAction,
  RentBasisNotFoundAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/rentbasis/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/rentbasis/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchRentBasisList = (search: string): FetchRentBasisListAction =>
  createAction('mvj/rentbasis/FETCH_ALL')(search);

export const receiveRentBasisList = (rentbasis: RentBasisList): ReceiveRentBasisListAction =>
  createAction('mvj/rentbasis/RECEIVE_ALL')(rentbasis);

export const fetchSingleRentBasis = (id: RentBasisId): FetchSingleRentBasisAction =>
  createAction('mvj/rentbasis/FETCH_SINGLE')(id);

export const receiveSingleRentBasis = (rentbasis: RentBasis): ReceiveSingleRentBasisAction =>
  createAction('mvj/rentbasis/RECEIVE_SINGLE')(rentbasis);

export const createRentBasis = (rentbasis: RentBasis): CreateRentBasisAction =>
  createAction('mvj/rentbasis/CREATE')(rentbasis);

export const editRentBasis = (rentbasis: RentBasis): EditRentBasisAction =>
  createAction('mvj/rentbasis/EDIT')(rentbasis);

export const notFound = (): RentBasisNotFoundAction =>
  createAction('mvj/rentbasis/NOT_FOUND')();

export const initializeRentBasis = (rentbasis: RentBasis): ReceiveRentBasisInitialValuesAction =>
  createAction('mvj/rentbasis/INITIALIZE')(rentbasis);

export const receiveIsSaveClicked = (isClicked: boolean): ReceiveIsSaveClickedAction =>
  createAction('mvj/rentbasis/RECEIVE_SAVE_CLICKED')(isClicked);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/rentbasis/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/rentbasis/SHOW_EDIT')();

export const receiveFormValid = (valid: boolean): ReceiveFormValidAction =>
  createAction('mvj/rentbasis/RECEIVE_FORM_VALID')(valid);
