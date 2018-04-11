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
  EditRentBasisAction,

  CreateRentCriteriaAction,
  HideEditModeAction,
  ReceiveRentCriteriaInitialValuesAction,
  RentBasisNotFoundAction,
  ShowEditModeAction,
} from './types';

export const notFound = (): RentBasisNotFoundAction =>
  createAction('mvj/rentbasis/NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/rentbasis/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/rentbasis/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchRentBasisList = (search: string): FetchRentBasisListAction =>
  createAction('mvj/rentbasis/FETCH_ALL')(search);

export const fetchSingleRentBasis = (id: RentBasisId): FetchSingleRentBasisAction =>
  createAction('mvj/rentbasis/FETCH_SINGLE')(id);

export const receiveRentBasisList = (rentbasis: RentBasisList): ReceiveRentBasisListAction =>
  createAction('mvj/rentbasis/RECEIVE_ALL')(rentbasis);

export const receiveSingleRentBasis = (rentbasis: RentBasis): ReceiveSingleRentBasisAction =>
  createAction('mvj/rentbasis/RECEIVE_SINGLE')(rentbasis);

export const createRentCriteria = (rentbasis: RentBasis): CreateRentCriteriaAction =>
  createAction('mvj/rentbasis/CREATE')(rentbasis);

export const editRentBasis = (rentbasis: RentBasis): EditRentBasisAction =>
  createAction('mvj/rentbasis/EDIT')(rentbasis);

export const initializeRentCriteria = (rentbasis: RentBasis): ReceiveRentCriteriaInitialValuesAction =>
  createAction('mvj/rentbasis/INITIALIZE')(rentbasis);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/rentbasis/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/rentbasis/SHOW_EDIT')();
