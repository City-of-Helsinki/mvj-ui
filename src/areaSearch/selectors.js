// @flow
import type {ApiResponse, Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.areaSearch.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.areaSearch.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingAttributes;

export const getAreaSearchList: Selector<ApiResponse | null, void> = (state: RootState): ApiResponse | null =>
  state.areaSearch.areaSearchList;

export const getIsFetchingAreaSearchList: Selector<boolean, void> = (state: RootState): boolean =>
  state.areaSearch.isFetchingAreaSearchList;
