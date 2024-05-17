import type { Selector } from "src/types";
import type { RootState } from "src/root/types";
import type { ServiceUnits } from "./types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.serviceUnits.isFetching;
export const getServiceUnits: Selector<ServiceUnits, void> = (state: RootState): ServiceUnits => state.serviceUnits.serviceUnits;