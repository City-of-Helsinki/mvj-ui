// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Selector} from '../types';
import type {
  Attributes,
  LandUseContractState,
  LandUseContract,
  LandUseContractList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: LandUseContractState): Attributes =>
  state.landUseContract.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: LandUseContractState): boolean =>
  state.landUseContract.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: LandUseContractState): boolean =>
  state.landUseContract.isFetching;

export const getIsSaveClicked: Selector<boolean, void> = (state: LandUseContractState): boolean =>
  state.landUseContract.isSaveClicked;

export const getLandUseContractList: Selector<LandUseContractList, void> = (state: LandUseContractState): LandUseContractList =>
  state.landUseContract.list;

export const getCurrentLandUseContract: Selector<LandUseContract, void> = (state: LandUseContractState): LandUseContract =>
  state.landUseContract.current;

export const getIsFormValidById: Selector<boolean, string> = (state: LandUseContractState, id: string): boolean =>
  state.landUseContract.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: LandUseContractState): Object =>
  state.landUseContract.isFormValidById;

export const getErrorsByFormName: Selector<?Object, string> = (state: Object, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getCollapseStateByKey: Selector<?Object, string> = (state: Object, key: string): ?Object => {
  return get(state.landUseContract.collapseStates, key);
};
