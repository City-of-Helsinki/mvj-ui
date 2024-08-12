import type { Action } from "@/types";
export type ContractId = number;
export type ReceiveContractFilePayload = {
  contractId: ContractId;
  files: Array<Record<string, any>>;
};
export type ContractFileState = {
  byId: Record<string, any>;
  isFetchingById: Record<string, any>;
};
export type FetchContractFilesByIdAction = Action<string, ContractId>;
export type ReceiveContractFilesByIdAction = Action<string, ReceiveContractFilePayload>;
export type NotFoundByIdAction = Action<string, ContractId>;