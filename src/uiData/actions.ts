import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type {
  UiDataList,
  CreateUiDataPayload,
  EditUiDataPayload,
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  AttributesNotFoundAction,
  FetchUiDataListAction,
  ReceiveUiDataListAction,
  CreateUiDataAction,
  DeleteUiDataAction,
  EditUiDataAction,
  NotFoundAction,
} from "@/uiData/types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/uiData/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/uiData/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/uiData/RECEIVE_METHODS")(methods);
export const attributesNotFound = (): AttributesNotFoundAction =>
  createAction("mvj/uiData/ATTRIBUTES_NOT_FOUND")();
export const fetchUiDataList = (
  query: Record<string, any>,
): FetchUiDataListAction => createAction("mvj/uiData/FETCH_ALL")(query);
export const receiveUiDataList = (
  uiDataList: UiDataList,
): ReceiveUiDataListAction =>
  createAction("mvj/uiData/RECEIVE_ALL")(uiDataList);
export const createUiData = (
  payload: CreateUiDataPayload,
): CreateUiDataAction => createAction("mvj/uiData/CREATE")(payload);
export const deleteUiData = (id: number): DeleteUiDataAction =>
  createAction("mvj/uiData/DELETE")(id);
export const editUiData = (payload: EditUiDataPayload): EditUiDataAction =>
  createAction("mvj/uiData/EDIT")(payload);
export const notFound = (): NotFoundAction =>
  createAction("mvj/uiData/NOT_FOUND")();
