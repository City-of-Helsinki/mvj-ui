import type { Action, Attributes, Methods } from "src/types";
export type UiDataState = {
  attributes: Attributes;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: UiDataList;
  methods: Methods;
};
export type CreateUiDataPayload = {
  key: string;
  value: string;
};
export type EditUiDataPayload = {
  id: number;
  key: string;
  value: string;
};
export type UiDataList = Array<Record<string, any>>;
export type FetchAttributesAction = Action<"mvj/uiData/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/uiData/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/uiData/RECEIVE_METHODS", Methods>;
export type AttributesNotFoundAction = Action<"mvj/uiData/ATTRIBUTES_NOT_FOUND", void>;
export type FetchUiDataListAction = Action<"mvj/uiData/FETCH_ALL", Record<string, any>>;
export type ReceiveUiDataListAction = Action<"mvj/uiData/RECEIVE_ALL", UiDataList>;
export type CreateUiDataAction = Action<"mvj/uiData/CREATE", CreateUiDataPayload>;
export type DeleteUiDataAction = Action<"mvj/uiData/DELETE", number>;
export type EditUiDataAction = Action<"mvj/uiData/EDIT", EditUiDataPayload>;
export type NotFoundAction = Action<"mvj/uiData/NOT_FOUND", void>;