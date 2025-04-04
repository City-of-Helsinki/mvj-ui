import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import merge from "lodash/merge";
import { FormNames } from "@/enums";
import type { Attributes, Methods, Reducer } from "@/types";
import type {
  InfillDevelopment,
  InfillDevelopmentList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveFormInitialValuesAction,
  ReceiveFormValidFlagsAction,
  ReceiveInfillDevelopmentListAction,
  ReceiveIsSaveClickedAction,
  ReceiveSingleInfillDevelopmentAction,
  ReceiveCollapseStatesAction,
} from "./types";
const isEditModeReducer: Reducer<boolean> = handleActions(
  {
    "mvj/infillDevelopment/HIDE_EDIT": () => false,
    "mvj/infillDevelopment/SHOW_EDIT": () => true,
  },
  false,
);
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/infillDevelopment/FETCH_ALL": () => true,
    "mvj/infillDevelopment/FETCH_SINGLE": () => true,
    "mvj/infillDevelopment/NOT_FOUND": () => false,
    "mvj/infillDevelopment/RECEIVE_ALL": () => false,
    "mvj/infillDevelopment/RECEIVE_SINGLE": () => false,
  },
  false,
);
const isSavingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/infillDevelopment/CREATE": () => true,
    "mvj/infillDevelopment/EDIT": () => true,
    "mvj/infillDevelopment/RECEIVE_SINGLE": () => false,
    "mvj/infillDevelopment/NOT_FOUND": () => false,
  },
  false,
);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/infillDevelopment/FETCH_ATTRIBUTES": () => true,
    "mvj/infillDevelopment/ATTRIBUTES_NOT_FOUND": () => false,
    "mvj/infillDevelopment/RECEIVE_METHODS": () => false,
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const methodsReducer: Reducer<Methods> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_METHODS"]: (
      state: Attributes,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const infillDevelopmentListReducer: Reducer<InfillDevelopmentList> =
  handleActions(
    {
      ["mvj/infillDevelopment/RECEIVE_ALL"]: (
        state: InfillDevelopmentList,
        { payload: infillDevelopments }: ReceiveInfillDevelopmentListAction,
      ) => {
        return infillDevelopments;
      },
    },
    {},
  );
const currentInfillDevelopmentReducer: Reducer<InfillDevelopment> =
  handleActions(
    {
      ["mvj/infillDevelopment/RECEIVE_SINGLE"]: (
        state: InfillDevelopment,
        { payload: infillDevelopment }: ReceiveSingleInfillDevelopmentAction,
      ) => {
        return infillDevelopment;
      },
    },
    {},
  );
const initialValuesReducer: Reducer<InfillDevelopment> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_INITIAL_VALUES"]: (
      state: InfillDevelopment,
      { payload: infillDevelopment }: ReceiveFormInitialValuesAction,
    ) => {
      return infillDevelopment;
    },
  },
  {},
);
const isSaveClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_SAVE_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsSaveClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
const isFormValidByIdReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_FORM_VALID_FLAGS"]: (
      state: Record<string, any>,
      { payload: valid }: ReceiveFormValidFlagsAction,
    ) => {
      return { ...state, ...valid };
    },
    ["mvj/infillDevelopment/CLEAR_FORM_VALID_FLAGS"]: () => {
      return {
        [FormNames.INFILL_DEVELOPMENT]: true,
      };
    },
  },
  {
    [FormNames.INFILL_DEVELOPMENT]: true,
  },
);
const collapseStatesReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/infillDevelopment/RECEIVE_COLLAPSE_STATES"]: (
      state: Record<string, any>,
      { payload: states }: ReceiveCollapseStatesAction,
    ) => {
      return merge(state, states);
    },
  },
  {},
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  collapseStates: collapseStatesReducer,
  current: currentInfillDevelopmentReducer,
  initialValues: initialValuesReducer,
  isFormValidById: isFormValidByIdReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  isSaving: isSavingReducer,
  list: infillDevelopmentListReducer,
  methods: methodsReducer,
});
