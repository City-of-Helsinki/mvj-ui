// @flow
import type {Selector} from '../types';
import type {
  DistrictList,
  DistrictState,
} from './types';

export const getIsFetching: Selector<boolean, void> = (state: DistrictState): boolean =>
  state.district.isFetching;

export const getDistrictsByMunicipality: Selector<?DistrictList, string> = (state: DistrictState, municipalityId: ?string): ?DistrictList => {
  return state.district.byMunicipality[municipalityId];
};
