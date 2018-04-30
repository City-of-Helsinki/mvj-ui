// @flow

import type {Action} from '../types';

export type DistrictState = Object;
export type DistrictList = Array<Object>;
export type DistrictListMap = {[key: string]: Object};

export type FetchDistrictsByMunicipalityAction = Action<'mvj/district/FETCH_BY_MUNICIPALITY', string>;
export type ReceiveDistrictsByMunicipalityAction = Action<'mvj/district/RECEIVE_BY_MUNICIPALITY', Object>;
export type DistrictNotFoundAction = Action<'mvj/district/NOT_FOUND', void>;
