// @flow
import type {Action} from '../types';

export type ContractId = number;
export type ReceiveContractFilePayload = {
  contractId: ContractId,
  files: Array<Object>,
}

export type ContractFileState = {
  byId: Object,
  isFetchingById: Object,
}

export type FetchContractFilesByIdAction = Action<'mvj/contractFile/FETCH_BY_ID', ContractId>;
export type ReceiveContractFilesByIdAction = Action<'mvj/contractFile/RECEIVE_BY_ID', ReceiveContractFilePayload>;
export type NotFoundByIdAction = Action<'mvj/contractFile/NOT_FOUND_BY_ID', ContractId>;
