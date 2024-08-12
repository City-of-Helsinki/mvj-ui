import type { RootState } from "root/types";
import type { Selector } from "types";
import type { ContractId } from "./types";
export const getContractFilesById: Selector<Array<Record<string, any>>, ContractId> = (state: RootState, id: ContractId): Array<Record<string, any>> => state.contractFile.byId[id];
export const getIsFetchingById: Selector<boolean, ContractId> = (state: RootState, id: ContractId): boolean => state.contractFile.isFetchingById[id];