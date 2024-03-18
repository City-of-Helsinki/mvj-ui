// @flow

import type {Action} from '../types';

export type ServiceUnit = Object;

export type ServiceUnits = Array<Object>;

export type ServiceUnitState = {
  isFetching: boolean,
  serviceUnits: ServiceUnits,
};

export type FetchServiceUnitsAction = Action<'mvj/searviceUnits/FETCH_ALL', void>;
export type ReceiveServiceUnitsAction = Action<'mvj/searviceUnits/RECEIVE_ALL', ServiceUnits>;

export type ServiceUnitsNotFoundAction = Action<'mvj/searviceUnits/NOT_FOUND', void>;
