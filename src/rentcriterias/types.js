// @flow

import type {Action} from '../types';

export type RentCriteriasState = Object;

export type Attributes = Object;

export type RentCriteria = Object;

export type RentCriteriasList = Array<RentCriteria>;

export type FetchRentCriteriasAction = Action<'mvj/rentcriterias/FETCH_ALL', string>;
export type ReceiveRentCriteriasAction = Action<'mvj/rentcriterias/RECEIVE_ALL', RentCriteriasList>;
