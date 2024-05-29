import type { Selector } from "types";
import type { RootState } from "root/types";
import type { ServiceUnits } from "./types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.serviceUnits.isFetching;
export const getServiceUnits: Selector<ServiceUnits, void> = (state: RootState): ServiceUnits => state.serviceUnits.serviceUnits;