// @flow
import type {Action, ApiResponse, Attributes, Methods} from '$src/types';

export type AreaSearchState = {
  attributes: Attributes,
  methods: Methods,
  isFetchingAttributes: boolean,
  areaSearchList: ApiResponse | null,
  isFetchingAreaSearchList: boolean,
};

export type AreaSearch = Object;

export type FetchAttributesAction = Action<'mvj/areaSearch/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/areaSearch/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/areaSearch/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/areaSearch/ATTRIBUTES_NOT_FOUND', void>;

export type FetchAreaSearchListAction = Action<'mvj/areaSearch/FETCH_ALL', Object>;
export type ReceiveAreaSearchListAction = Action<'mvj/areaSearch/RECEIVE_ALL', Object>;
export type AreaSearchesNotFoundAction = Action<'mvj/areaSearch/NOT_FOUND', void>;