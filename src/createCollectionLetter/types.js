// @flow
import type {Action, Attributes} from '../types';

export type CreateCollectionLetterState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
};

export type FetchAttributesAction = Action<'mvj/createCollectionLetter/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/createCollectionLetter/RECEIVE_ATTRIBUTES', Attributes>;
export type AttributesNotFoundAction = Action<'mvj/createCollectionLetter/ATTRIBUTES_NOT_FOUND', void>;
