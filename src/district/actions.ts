import { createAction } from "redux-actions";
import type { FetchDistrictsByMunicipalityAction, ReceiveDistrictsByMunicipalityAction, DistrictNotFoundAction } from "./types";
export const notFound = (): DistrictNotFoundAction => createAction('mvj/district/NOT_FOUND')();
export const fetchDistrictsByMunicipality = (municipalityId: number): FetchDistrictsByMunicipalityAction => createAction('mvj/district/FETCH_BY_MUNICIPALITY')(municipalityId);
export const receiveDistrictsByMunicipality = (districts: Record<string, any>): ReceiveDistrictsByMunicipalityAction => createAction('mvj/district/RECEIVE_BY_MUNICIPALITY')(districts);