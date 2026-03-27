import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type { DistrictList } from "./types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.district.isFetching;
export const getDistrictsByMunicipality: Selector<
  DistrictList | null | undefined,
  number
> = (
  state: RootState,
  municipalityId: number,
): DistrictList | null | undefined => {
  return state.district.byMunicipality[municipalityId];
};
