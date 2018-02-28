// @flow

import {createAction} from 'redux-actions';

import type {
  RentCriteria,
  RentCriteriasList,
  FetchRentCriteriasAction,
  ReceiveRentCriteriasAction,
  ReceiveRentCriteriaInitialValuesAction,
} from './types';

export const fetchRentCriterias = (search: string): FetchRentCriteriasAction =>
  createAction('mvj/rentcriterias/FETCH_ALL')(search);

export const receiveRentCriterias = (rentcriterias: RentCriteriasList): ReceiveRentCriteriasAction =>
  createAction('mvj/rentcriterias/RECEIVE_ALL')(rentcriterias);

export const initializeRentCriteria = (rentCriteria: RentCriteria): ReceiveRentCriteriaInitialValuesAction =>
  createAction('mvj/rentcriterias/INITIALIZE')(rentCriteria);
