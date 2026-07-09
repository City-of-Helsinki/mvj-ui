import type { Selector } from "@/types";
import type { RootState } from "@/root/types";
import type { IntendedUseList } from "@/intendedUse/types";

export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.intendedUse.isFetching;

export const getIntendedUseList: Selector<IntendedUseList, void> = (
  state: RootState,
): IntendedUseList => state.intendedUse.list;
