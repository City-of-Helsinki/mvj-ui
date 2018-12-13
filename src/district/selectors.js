// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {DistrictList} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.district.isFetching;

export const getDistrictsByMunicipality: Selector<?DistrictList, number> = (state: RootState, municipalityId: number): ?DistrictList => {
  return state.district.byMunicipality[municipalityId];
};
