// @flow
import type {Selector} from '../types';

import type {
  Attributes,
  LandUseContractState,
  LandUseContract,
  LandUseContractList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: LandUseContractState): Attributes =>
  state.landUseContract.attributes;

export const getIsFetching: Selector<boolean, void> = (state: LandUseContractState): boolean =>
  state.landUseContract.isFetching;

export const getLandUseContractList: Selector<LandUseContractList, void> = (state: LandUseContractState): LandUseContractList =>
  state.landUseContract.list;

export const getCurrentLandUseContract: Selector<LandUseContract, void> = (state: LandUseContractState): LandUseContract =>
  state.landUseContract.current;
