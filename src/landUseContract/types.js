// @flow
import type {Action} from '../types';

export type Attributes = {};
export type LandUseContractState = Object;
export type LandUseContractId = number;
export type LandUseContract = Object;
export type LandUseContractList = Object;

export type FetchAttributesAction = Action<'mvj/landUseContract/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/landUseContract/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchLandUseContractListAction = Action<'mvj/landUseContract/FETCH_ALL', string>;
export type ReceiveLandUseContractListAction = Action<'mvj/landUseContract/RECEIVE_ALL', LandUseContractList>;
export type FetchSingleLandUseContractAction = Action<'mvj/landUseContract/FETCH_SINGLE', LandUseContractId>;
export type ReceiveSingleLandUseContractAction = Action<'mvj/landUseContract/RECEIVE_SINGLE', LandUseContract>;
