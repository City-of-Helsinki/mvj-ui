// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {IndexList} from '$src/index/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.index.isFetching;

export const getIndexList: Selector<IndexList, void> = (state: RootState): IndexList =>
  state.index.list;
