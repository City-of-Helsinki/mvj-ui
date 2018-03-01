// @flow

import type {Action} from '../types';

export type RentCriteriasState = Object;

export type Attributes = Object;

export type RentCriteria = Object;

export type RentCriteriasList = Array<RentCriteria>;

export type EditRentCriteriaAction = Action<'mvj/rentcriterias/EDIT', RentCriteria>;
export type FetchRentCriteriasAction = Action<'mvj/rentcriterias/FETCH_ALL', string>;
export type FetchSingleRentCriteriaAction = Action<'mvj/rentcriterias/FETCH_SINGLE', void>;
export type HideEditModeAction = Action<'mvj/rentcriterias/HIDE_EDIT', void>;
export type ReceiveRentCriteriasAction = Action<'mvj/rentcriterias/RECEIVE_ALL', RentCriteriasList>;
export type ReceiveRentCriteriaInitialValuesAction = Action<'mvj/rentcriterias/INITIALIZE', RentCriteria>;
export type ReceiveSingleRentCriteriaAction = Action<'mvj/rentcriterias/RECEIVE_SINGLE', RentCriteria>;
export type ShowEditModeAction = Action<'mvj/rentcriterias/SHOW_EDIT', void>;
