// @flow
import type {Action} from '../types';

export type InfillDevelopmentState = Object;
export type InfillDevelopmentId = number;
export type InfillDevelopment = Object;
export type InfillDevelopmentList = Object;
export type Attributes = Object;

export type FetchInfillDevelopmentListAction = Action<'mvj/infillDevelopment/FETCH_ALL', string>;
export type ReceiveInfillDevelopmentListAction = Action<'mvj/infillDevelopment/RECEIVE_ALL', InfillDevelopmentList>;
export type FetchSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/FETCH_SINGLE', InfillDevelopmentId>;
export type ReceiveSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/RECEIVE_SINGLE', InfillDevelopment>;

export type InfillDevelopmentNotFoundAction = Action<'mvj/infillDevelopment/NOT_FOUND', void>;
