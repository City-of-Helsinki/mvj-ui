import type { Selector } from "@/types";
import type { RootState } from "@/root/types";
import type { OldDwellingsInHousingCompaniesPriceIndex } from "./types";

export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.oldDwellingsInHousingCompaniesPriceIndex.isFetching;
export const getOldDwellingsInHousingCompaniesPriceIndex: Selector<
  OldDwellingsInHousingCompaniesPriceIndex,
  void
> = (state: RootState): OldDwellingsInHousingCompaniesPriceIndex => {
  return state.oldDwellingsInHousingCompaniesPriceIndex.latest;
};
