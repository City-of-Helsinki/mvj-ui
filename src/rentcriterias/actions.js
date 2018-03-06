// @flow

import {createAction} from 'redux-actions';

import type {
  CreateRentCriteriaAction,
  EditRentCriteriaAction,
  FetchRentCriteriasAction,
  FetchSingleRentCriteriaAction,
  HideEditModeAction,
  ReceiveRentCriteriasAction,
  ReceiveRentCriteriaInitialValuesAction,
  ReceiveSingleRentCriteriaAction,
  RentCriteria,
  RentCriteriasList,
  ShowEditModeAction,
} from './types';

export const createRentCriteria = (rentcriteria: RentCriteria): CreateRentCriteriaAction =>
  createAction('mvj/rentcriteria/CREATE')(rentcriteria);

export const editRentCriteria = (rentcriteria: RentCriteria): EditRentCriteriaAction =>
  createAction('mvj/rentcriteria/EDIT')(rentcriteria);

export const fetchRentCriterias = (search: string): FetchRentCriteriasAction =>
  createAction('mvj/rentcriteria/FETCH_ALL')(search);

export const fetchSingleRentCriteria = (): FetchSingleRentCriteriaAction =>
  createAction('mvj/rentcriteria/FETCH_SINGLE')();

export const initializeRentCriteria = (rentCriteria: RentCriteria): ReceiveRentCriteriaInitialValuesAction =>
  createAction('mvj/rentcriteria/INITIALIZE')(rentCriteria);

export const receiveRentCriterias = (rentcriterias: RentCriteriasList): ReceiveRentCriteriasAction =>
  createAction('mvj/rentcriteria/RECEIVE_ALL')(rentcriterias);

export const receiveSingleRentCriteria = (rentcriteria: RentCriteria): ReceiveSingleRentCriteriaAction =>
  createAction('mvj/rentcriteria/RECEIVE_SINGLE')(rentcriteria);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/rentcriteria/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/rentcriteria/SHOW_EDIT')();
