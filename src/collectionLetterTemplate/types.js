// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type CollectionLetterTemplateState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: CollectionLetterTemplates,
  methods: Methods,
};
export type CollectionLetterTemplates = Array<Object>;

export type FetchAttributesAction = Action<'mvj/collectionLetterTemplate/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/collectionLetterTemplate/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/collectionLetterTemplate/RECEIVE_METHODS', Methods>;
export type CollectionLetterTemplateAttributesNotFoundAction = Action<'mvj/collectionLetterTemplate/ATTRIBUTES_NOT_FOUND', void>;
export type FetchCollectionLetterTemplatesAction = Action<'mvj/collectionLetterTemplate/FETCH_ALL', void>;
export type ReceiveCollectionLetterTemplatesAction = Action<'mvj/collectionLetterTemplate/RECEIVE_ALL', CollectionLetterTemplates>;
export type CollectionLetterTemplatesNotFoundAction = Action<'mvj/collectionLetterTemplate/NOT_FOUND', void>;
