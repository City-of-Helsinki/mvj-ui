import type { Selector } from "@/types";
import type { RootState } from "@/root/types";
import type { VatList } from "./types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.vat.isFetching;
export const getVats: Selector<VatList, void> = (state: RootState): VatList => {
  return state.vat.list;
};