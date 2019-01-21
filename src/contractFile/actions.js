// @flow

import {createAction} from 'redux-actions';

import type {Methods} from '$src/types';
import type {
  ContractId,
  ReceiveContractFilePayload,
  FetchAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchContractFilesByIdAction,
  ReceiveContractFilesByIdAction,
  NotFoundByIdAction,
} from './types';

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/contractFile/FETCH_ATTRIBUTES')();

export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction('mvj/contractFile/RECEIVE_METHODS')(methods);

export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction('mvj/contractFile/ATTRIBUTES_NOT_FOUND')();

export const fetchContractFilesById = (contract: ContractId): FetchContractFilesByIdAction =>
  createAction('mvj/contractFile/FETCH_BY_ID')(contract);

export const receiveContractFilesById = (payload: ReceiveContractFilePayload): ReceiveContractFilesByIdAction =>
  createAction('mvj/contractFile/RECEIVE_BY_ID')(payload);

export const notFoundById = (contract: ContractId): NotFoundByIdAction =>
  createAction('mvj/contractFile/NOT_FOUND_BY_ID')(contract);
