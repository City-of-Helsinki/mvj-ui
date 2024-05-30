import type { Action } from "../types";
export type DistrictState = {
  byMunicipality: DistrictListMap;
  isFetching: boolean;
};
export type DistrictList = Array<Record<string, any>>;
export type DistrictListMap = Record<number, DistrictList>;
export type FetchDistrictsByMunicipalityAction = Action<string, number>;
export type ReceiveDistrictsByMunicipalityAction = Action<string, Record<string, any>>;
export type DistrictNotFoundAction = Action<string, void>;