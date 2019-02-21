// @flow
import type {Action, Methods} from '../types';

export type CopyAreasToContractState = {
  isFetchingAttributes: boolean,
  methods: Methods,
};

export type FetchAttributesAction = Action<'mvj/copyAreasToContract/FETCH_ATTRIBUTES', void>;
export type ReceiveMethodsAction = Action<'mvj/copyAreasToContract/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND', void>;
