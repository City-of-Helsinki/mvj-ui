// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type IndexState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: IndexList,
  methods: Methods,
}

export type IndexList = Array<Object>;

export type FetchAttributesAction = Action<'mvj/index/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/index/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/index/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/index/ATTRIBUTES_NOT_FOUND', void>;
export type FetchIndexListAction = Action<'mvj/index/FETCH_ALL', Object>;
export type ReceiveIndexListAction = Action<'mvj/index/RECEIVE_ALL', IndexList>;
export type NotFoundAction = Action<'mvj/index/NOT_FOUND', void>;
