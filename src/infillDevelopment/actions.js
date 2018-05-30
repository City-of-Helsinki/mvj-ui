// @flow
import {createAction} from 'redux-actions';
import type {
  FetchInfillDevelopmentListAction,
  FetchSingleInfillDevelopmentAction,
  InfillDevelopment,
  InfillDevelopmentId,
  InfillDevelopmentList,
  ReceiveInfillDevelopmentListAction,
  ReceiveSingleInfillDevelopmentAction,
  InfillDevelopmentNotFoundAction,
} from './types';

export const fetchInfillDevelopments = (search: string): FetchInfillDevelopmentListAction =>
  createAction('mvj/infillDevelopment/FETCH_ALL')(search);

export const receiveInfillDevelopments= (infillDevelopments: InfillDevelopmentList): ReceiveInfillDevelopmentListAction =>
  createAction('mvj/infillDevelopment/RECEIVE_ALL')(infillDevelopments);

export const fetchSingleInfillDevelopment = (id: InfillDevelopmentId): FetchSingleInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/FETCH_SINGLE')(id);

export const receiveSingleInfillDevelopment = (infillDevelopment: InfillDevelopment): ReceiveSingleInfillDevelopmentAction =>
  createAction('mvj/infillDevelopment/RECEIVE_SINGLE')(infillDevelopment);

export const notFound = (): InfillDevelopmentNotFoundAction =>
  createAction('mvj/infillDevelopment/NOT_FOUND')();
