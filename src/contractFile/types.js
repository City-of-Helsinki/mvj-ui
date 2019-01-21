// @flow
import type {Action, Methods} from '../types';

export type ContractId = number;
export type ReceiveContractFilePayload = {
  contractId: ContractId,
  files: Array<Object>,
}

export type ContractFileState = {
  byId: Object,
  isFetchingAttributes: boolean,
  isFetchingById: Object,
  methods: Methods,
}
export type FetchAttributesAction = Action<'mvj/contractFile/FETCH_ATTRIBUTES', void>;
export type ReceiveMethodsAction = Action<'mvj/contractFile/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/contractFile/ATTRIBUTES_NOT_FOUND', void>;

export type FetchContractFilesByIdAction = Action<'mvj/contractFile/FETCH_BY_ID', ContractId>;
export type ReceiveContractFilesByIdAction = Action<'mvj/contractFile/RECEIVE_BY_ID', ReceiveContractFilePayload>;
export type NotFoundByIdAction = Action<'mvj/contractFile/NOT_FOUND_BY_ID', ContractId>;
