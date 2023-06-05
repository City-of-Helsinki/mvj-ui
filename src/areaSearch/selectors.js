// @flow
import type {ApiResponse, Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import get from 'lodash/get';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.areaSearch.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.areaSearch.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingAttributes;

export const getAreaSearchList: Selector<ApiResponse, void> = (state: RootState): ApiResponse =>
  state.areaSearch.areaSearchList;

export const getAreaSearchListByBBox: Selector<ApiResponse, void> = (state: RootState): ApiResponse =>
  state.areaSearch.areaSearchListByBBox;

export const getIsFetchingAreaSearchList: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingAreaSearchList;

export const getIsFetchingAreaSearchListByBBox: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingAreaSearchListByBBox;

export const getCurrentAreaSearch: Selector<Object, void> = (state: RootState): Object =>
  state.areaSearch.currentAreaSearch;

export const getIsFetchingCurrentAreaSearch: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingCurrentAreaSearch;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isEditMode;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isSaveClicked;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.areaSearch.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.areaSearch.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.areaSearch.isFormValidById;
