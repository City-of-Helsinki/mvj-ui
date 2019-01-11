// @flow
import type {Action, Attributes, Methods} from '../types';

export type CreateCollectionLetterState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
};

export type FetchAttributesAction = Action<'mvj/createCollectionLetter/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/createCollectionLetter/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/createCollectionLetter/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/createCollectionLetter/ATTRIBUTES_NOT_FOUND', void>;
