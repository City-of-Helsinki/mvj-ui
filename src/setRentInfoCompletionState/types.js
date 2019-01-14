// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type SetRentInfoCompletionStateState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type FetchAttributesAction = Action<'mvj/setRentInfoCompletionState/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/setRentInfoCompletionState/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/setRentInfoCompletionState/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/setRentInfoCompletionState/ATTRIBUTES_NOT_FOUND', void>;
