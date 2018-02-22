// @flow

import {createAction} from 'redux-actions';

import type {
  RentCriteriasList,
  FetchRentCriteriasAction,
  ReceiveRentCriteriasAction,
} from './types';

export const fetchRentCriterias = (search: string): FetchRentCriteriasAction =>
  createAction('mvj/rentcriterias/FETCH_ALL')(search);

export const receiveRentCriterias = (rentcriterias: RentCriteriasList): ReceiveRentCriteriasAction =>
  createAction('mvj/rentcriterias/RECEIVE_ALL')(rentcriterias);
