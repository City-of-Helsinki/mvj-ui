// @flow
import type {Action} from '../types';

export type CollectionLetterTemplateState = Object;
export type CollectionLetterTemplates = Array<Object>;

export type FetchCollectionLetterTemplatesAction = Action<'mvj/collectionLetterTemplate/FETCH_ALL', void>;
export type ReceiveCollectionLetterTemplatesAction = Action<'mvj/collectionLetterTemplate/RECEIVE_ALL', CollectionLetterTemplates>;
export type CollectionLetterTemplatesNotFoundAction = Action<'mvj/collectionLetterTemplate/NOT_FOUND', void>;
