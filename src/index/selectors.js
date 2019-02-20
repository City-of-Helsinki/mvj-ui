// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {IndexList} from '$src/index/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.index.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.index.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.index.methods;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.index.isFetching;

export const getIndexList: Selector<IndexList, void> = (state: RootState): IndexList =>
  state.index.list;
