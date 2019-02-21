// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type UiDataState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: UiDataList,
  methods: Methods,
}

export type UiDataList = Array<Object>;

export type FetchAttributesAction = Action<'mvj/uiData/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/uiData/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/uiData/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/uiData/ATTRIBUTES_NOT_FOUND', void>;
export type FetchUiDataListAction = Action<'mvj/uiData/FETCH_ALL', Object>;
export type ReceiveUiDataListAction = Action<'mvj/uiData/RECEIVE_ALL', UiDataList>;
export type NotFoundAction = Action<'mvj/uiData/NOT_FOUND', void>;
