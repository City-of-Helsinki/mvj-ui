// @flow

import type {Action} from '../types';

export type RentCriteriasState = Object;

export type Attributes = Object;

export type RentCriteria = Object;

export type RentCriteriasList = Array<RentCriteria>;

export type CreateRentCriteriaAction = Action<'mvj/rentcriteria/CREATE', RentCriteria>;
export type EditRentCriteriaAction = Action<'mvj/rentcriteria/EDIT', RentCriteria>;
export type FetchRentCriteriasAction = Action<'mvj/rentcriteria/FETCH_ALL', string>;
export type FetchSingleRentCriteriaAction = Action<'mvj/rentcriteria/FETCH_SINGLE', void>;
export type ReceiveRentCriteriasAction = Action<'mvj/rentcriteria/RECEIVE_ALL', RentCriteriasList>;
export type ReceiveRentCriteriaInitialValuesAction = Action<'mvj/rentcriteria/INITIALIZE', RentCriteria>;
export type ReceiveSingleRentCriteriaAction = Action<'mvj/rentcriteria/RECEIVE_SINGLE', RentCriteria>;
export type HideEditModeAction = Action<'mvj/rentcriteria/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/rentcriteria/SHOW_EDIT', void>;
