// @flow

import type {Action} from '../types';

export type RentBasisState = Object;

export type Attributes = Object;

export type RentBasis = Object;

export type RentBasisList = Object;

export type FetchAttributesAction = Action<'mvj/rentbasis/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/rentbasis/RECEIVE_ATTRIBUTES', Attributes>;

export type CreateRentCriteriaAction = Action<'mvj/rentbasis/CREATE', RentBasis>;
export type EditRentCriteriaAction = Action<'mvj/rentbasis/EDIT', RentBasis>;
export type FetchRentBasisListAction = Action<'mvj/rentbasis/FETCH_ALL', string>;
export type FetchSingleRentCriteriaAction = Action<'mvj/rentbasis/FETCH_SINGLE', void>;
export type ReceiveRentBasisListAction = Action<'mvj/rentbasis/RECEIVE_ALL', RentBasisList>;
export type ReceiveRentCriteriaInitialValuesAction = Action<'mvj/rentbasis/INITIALIZE', RentBasis>;
export type ReceiveSingleRentCriteriaAction = Action<'mvj/rentbasis/RECEIVE_SINGLE', RentBasis>;
export type RentBasisNotFoundAction = Action<'mvj/rentbasis/NOT_FOUND', void>;
export type HideEditModeAction = Action<'mvj/rentbasis/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/rentbasis/SHOW_EDIT', void>;
