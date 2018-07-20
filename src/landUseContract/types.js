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

export type EditLandUseContractAction = Action<'mvj/landUseContract/EDIT', LandUseContract>;
export type LandUseContractNotFoundAction = Action<'mvj/landUseContract/NOT_FOUND', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/landUseContract/RECEIVE_SAVE_CLICKED', boolean>;

export type HideEditModeAction = Action<'mvj/landUseContract/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/landUseContract/SHOW_EDIT', void>;

export type ReceiveFormValidFlagsAction = Action<'mvj/landUseContract/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/landUseContract/CLEAR_FORM_VALID_FLAGS', void>;
