import type { Action, Attributes, Methods } from "types";
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
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchUiDataListAction = Action<string, Record<string, any>>;
export type ReceiveUiDataListAction = Action<string, UiDataList>;
export type CreateUiDataAction = Action<string, CreateUiDataPayload>;
export type DeleteUiDataAction = Action<string, number>;
export type EditUiDataAction = Action<string, EditUiDataPayload>;
export type NotFoundAction = Action<string, void>;