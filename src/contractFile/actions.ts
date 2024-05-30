import { createAction } from "redux-actions";
import type { ContractId, ReceiveContractFilePayload, FetchContractFilesByIdAction, ReceiveContractFilesByIdAction, NotFoundByIdAction } from "./types";
export const fetchContractFilesById = (contract: ContractId): FetchContractFilesByIdAction => createAction('mvj/contractFile/FETCH_BY_ID')(contract);
export const receiveContractFilesById = (payload: ReceiveContractFilePayload): ReceiveContractFilesByIdAction => createAction('mvj/contractFile/RECEIVE_BY_ID')(payload);
export const notFoundById = (contract: ContractId): NotFoundByIdAction => createAction('mvj/contractFile/NOT_FOUND_BY_ID')(contract);