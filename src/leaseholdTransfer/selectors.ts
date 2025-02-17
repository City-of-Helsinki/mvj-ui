import type { Attributes, Methods, Selector } from "types";
import type { LeaseholdTransferList } from "@/leaseholdTransfer/types";
import type { RootState } from "@/root/types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseholdTransfer.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseholdTransfer.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.leaseholdTransfer.methods;
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseholdTransfer.isFetching;
export const getLeaseholdTransferList: Selector<LeaseholdTransferList, void> = (
  state: RootState,
): LeaseholdTransferList => state.leaseholdTransfer.list;
