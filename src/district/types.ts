import type { Action } from "../types";
export type DistrictState = {
  byMunicipality: DistrictListMap;
  isFetching: boolean;
};
export type DistrictList = Array<Record<string, any>>;
export type DistrictListMap = Record<number, DistrictList>;
export type FetchDistrictsByMunicipalityAction = Action<"mvj/district/FETCH_BY_MUNICIPALITY", number>;
export type ReceiveDistrictsByMunicipalityAction = Action<"mvj/district/RECEIVE_BY_MUNICIPALITY", Record<string, any>>;
export type DistrictNotFoundAction = Action<"mvj/district/NOT_FOUND", void>;