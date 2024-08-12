import type { RootState } from "@/root/types";
import type { Selector } from "@/types";
import type { LeaseTypeList } from "./types";
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.leaseType.isFetching;
export const getLeaseTypeList: Selector<LeaseTypeList, void> = (state: RootState): LeaseTypeList => state.leaseType.list;