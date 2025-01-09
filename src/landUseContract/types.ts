import type { Action, Attributes, Methods } from "@/types";
export type LandUseContractState = {
  attributes: Attributes;
  current: LandUseContract;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isFormValidById: Record<string, any>;
  isSaveClicked: boolean;
  list: LandUseContractList;
  methods: Methods;
  collapseStates?: any;
};
export type FetchSingleLandUseContractAfterEditPayload = {
  id: any;
  callbackFunctions?: Array<
    Record<string, any> | ((...args: Array<any>) => any)
  >;
};
export type InvoiceListMap = Record<string, any>;
export type LandUseContract = Record<string, any>;
export type LandUseContractList = any;
export type LandUseContractId = number;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type AttributesNotFoundAction = Action<string, void>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type FetchLandUseContractListAction = Action<string, string>;
export type ReceiveLandUseContractListAction = Action<
  string,
  LandUseContractList
>;
export type FetchSingleLandUseContractAction = Action<
  string,
  LandUseContractId
>;
export type ReceiveSingleLandUseContractAction = Action<
  string,
  LandUseContract
>;
export type FetchSingleLandUseContractAfterEditAction = Action<
  string,
  FetchSingleLandUseContractAfterEditPayload
>;
export type DeleteLandUseContractAction = Action<string, LandUseContractId>;
export type CreateLandUseContractAction = Action<string, LandUseContract>;
export type EditLandUseContractAction = Action<string, LandUseContract>;
export type LandUseContractNotFoundAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
