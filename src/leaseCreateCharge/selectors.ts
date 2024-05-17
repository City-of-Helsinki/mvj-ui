import type { Attributes, Selector } from "src/types";
import type { RootState } from "src/root/types";
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.leaseCreateCharge.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.leaseCreateCharge.attributes;
export const getIsFetchingReceivableTypes: Selector<boolean, void> = (state: RootState): boolean => state.leaseCreateCharge.isFetchingReceivableTypes;
export const getReceivableTypes: Selector<Attributes, void> = (state: RootState): Attributes => state.leaseCreateCharge.receivableTypes;