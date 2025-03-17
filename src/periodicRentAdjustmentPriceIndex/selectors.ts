import type { Selector } from "@/types";
import type { RootState } from "@/root/types";
import type { PeriodicRentAdjustmentPriceIndex } from "./types";

export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.periodicRentAdjustmentPriceIndex.isFetching;
export const getPeriodicRentAdjustmentPriceIndex: Selector<
  PeriodicRentAdjustmentPriceIndex,
  void
> = (state: RootState): PeriodicRentAdjustmentPriceIndex => {
  return state.periodicRentAdjustmentPriceIndex.latest;
};
