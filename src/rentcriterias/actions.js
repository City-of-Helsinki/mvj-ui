// @flow

import {createAction} from 'redux-actions';

import type {
  RentCriteria,
  RentCriteriasList,
  EditRentCriteriaAction,
  FetchRentCriteriasAction,
  FetchSingleRentCriteriaAction,
  HideEditModeAction,
  ReceiveRentCriteriasAction,
  ReceiveRentCriteriaInitialValuesAction,
  ReceiveSingleRentCriteriaAction,
  ShowEditModeAction,
} from './types';

export const editRentCriteria = (rentcriteria: RentCriteria): EditRentCriteriaAction =>
  createAction('mvj/rentcriterias/EDIT')(rentcriteria);

export const fetchRentCriterias = (search: string): FetchRentCriteriasAction =>
  createAction('mvj/rentcriterias/FETCH_ALL')(search);

export const fetchSingleRentCriteria = (): FetchSingleRentCriteriaAction =>
  createAction('mvj/rentcriterias/FETCH_SINGLE')();

export const initializeRentCriteria = (rentCriteria: RentCriteria): ReceiveRentCriteriaInitialValuesAction =>
  createAction('mvj/rentcriterias/INITIALIZE')(rentCriteria);

export const receiveRentCriterias = (rentcriterias: RentCriteriasList): ReceiveRentCriteriasAction =>
  createAction('mvj/rentcriterias/RECEIVE_ALL')(rentcriterias);

export const receiveSingleRentCriteria = (rentcriteria: RentCriteria): ReceiveSingleRentCriteriaAction =>
  createAction('mvj/rentcriterias/RECEIVE_SINGLE')(rentcriteria);

export const hideEditMode = (): HideEditModeAction =>
  createAction('mvj/rentcriterias/HIDE_EDIT')();

export const showEditMode = (): ShowEditModeAction =>
  createAction('mvj/rentcriterias/SHOW_EDIT')();
