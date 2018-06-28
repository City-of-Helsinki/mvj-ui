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
