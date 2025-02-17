import type { Action, Attributes, Methods } from "@/types";
export type InfillDevelopmentState = {
  attributes: Attributes;
  collapseStates: Record<string, any>;
  current: InfillDevelopment;
  initialValues: InfillDevelopment;
  isFormValidById: Record<string, any>;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaveClicked: boolean;
  isSaving: boolean;
  list: InfillDevelopmentList;
  methods: Methods;
};
export type InfillDevelopmentId = number;
export type InfillDevelopment = Record<string, any>;
export type InfillDevelopmentList = any;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type InfillDevelopmentAttributesNotFoundAction = Action<string, void>;
export type FetchInfillDevelopmentListAction = Action<
  string,
  Record<string, any>
>;
export type ReceiveInfillDevelopmentListAction = Action<
  string,
  InfillDevelopmentList
>;
export type FetchSingleInfillDevelopmentAction = Action<
  string,
  InfillDevelopmentId
>;
export type ReceiveSingleInfillDevelopmentAction = Action<
  string,
  InfillDevelopment
>;
export type CreateInfillDevelopmentAction = Action<string, InfillDevelopment>;
export type EditInfillDevelopmentAction = Action<string, InfillDevelopment>;
export type InfillDevelopmentNotFoundAction = Action<string, void>;
export type HideEditModeAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type ReceiveIsSaveClickedAction = Action<string, boolean>;
export type ReceiveFormValidFlagsAction = Action<string, Record<string, any>>;
export type ClearFormValidFlagsAction = Action<string, void>;
export type ReceiveFormInitialValuesAction = Action<string, InfillDevelopment>;
export type ReceiveCollapseStatesAction = Action<string, Record<string, any>>;
