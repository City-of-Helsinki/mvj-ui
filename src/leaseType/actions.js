// @flow
import {createAction} from 'redux-actions';
import type {
  LeaseTypeList,
  FetchLeaseTypesAction,
  ReceiveLeaseTypesAction,
  LeaseTypesNotFoundAction,
} from './types';


export const fetchLeaseTypes = (): FetchLeaseTypesAction =>
  createAction('mvj/leaseType/FETCH_ALL')();

export const receiveLeaseTypes = (list: LeaseTypeList): ReceiveLeaseTypesAction =>
  createAction('mvj/leaseType/RECEIVE_ALL')(list);

export const notFound = (): LeaseTypesNotFoundAction =>
  createAction('mvj/leaseType/NOT_FOUND')();
