import type { Attributes, Selector } from "types";
import type { RootState } from "@/root/types";
import { ReceivableType } from "@/leases/types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseCreateCharge.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.leaseCreateCharge.attributes;
export const getIsFetchingReceivableTypes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.leaseCreateCharge.isFetchingReceivableTypes;
export const getReceivableTypes: Selector<ReceivableType[], void> = (
  state: RootState,
): ReceivableType[] => state.leaseCreateCharge.receivableTypes;
