// @flow
import type {Action, Attributes, Methods} from '../types';

export type CopyAreasToContractState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
};

export type FetchAttributesAction = Action<'mvj/copyAreasToContract/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/copyAreasToContract/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/copyAreasToContract/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/copyAreasToContract/ATTRIBUTES_NOT_FOUND', void>;
