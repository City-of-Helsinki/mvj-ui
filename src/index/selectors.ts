import type { Selector } from "types";
import type { RootState } from "root/types";
import type { IndexList } from "/src/index/types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.index.isFetching;
export const getIndexList: Selector<IndexList, void> = (state: RootState): IndexList => state.index.list;