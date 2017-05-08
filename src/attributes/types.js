// @flow

import type {Action} from '../types';

export type AttributesState = Object;

export type FetchAttributesAction = Action<'mvj/attribute/FETCH', void>;
export type ReceiveAttributesAction = Action<'mvj/attribute/RECEIVE', AttributesState>;
export type AttributesNotFoundAction = Action<'mvj/attribute/NOT_FOUND', void>;
