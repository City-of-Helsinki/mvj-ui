import { combineReducers } from "redux";
import type { Action } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type {
  AreaSearchState,
  ReceiveAreaSearchEditFailedAction,
  ReceiveAreaSearchListAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceiveSingleAreaSearchAction,
} from "@/areaSearch/types";
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  SetAreaSearchAttachmentsAction,
} from "@/areaSearch/types";
import type { ApiResponse } from "types";
import merge from "lodash/merge";
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_ATTRIBUTES"]: (
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
    ["mvj/areaSearch/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/FETCH_ATTRIBUTES"]: () => true,
    ["mvj/areaSearch/RECEIVE_ATTRIBUTES"]: () => false,
    ["mvj/areaSearch/ATTRIBUTES_NOT_FOUND"]: () => false,
    ["mvj/areaSearch/RECEIVE_METHODS"]: () => false,
  },
  false,
);
const listAttributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const listMethodsReducer: Reducer<Methods> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_LIST_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const isFetchingListAttributesReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/FETCH_LIST_ATTRIBUTES"]: () => true,
    ["mvj/areaSearch/RECEIVE_LIST_ATTRIBUTES"]: () => false,
    ["mvj/areaSearch/LIST_ATTRIBUTES_NOT_FOUND"]: () => false,
    ["mvj/areaSearch/RECEIVE_LIST_METHODS"]: () => false,
  },
  false,
);
const areaSearchListReducer: Reducer<any> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_ALL"]: (
      state: ApiResponse,
      { payload: response }: ReceiveAreaSearchListAction,
    ) => {
      return response || null;
    },
  },
  null,
);
const isFetchingAreaSearchListReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/FETCH_ALL"]: () => true,
    ["mvj/areaSearch/RECEIVE_ALL"]: () => false,
    ["mvj/areaSearch/NOT_FOUND"]: () => false,
  },
  false,
);
const areaSearchListByBBoxReducer: Reducer<any> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_ALL_BY_BBOX"]: (
      state: ApiResponse,
      { payload: response }: ReceiveAreaSearchListAction,
    ) => {
      return response || null;
    },
  },
  null,
);
const isFetchingAreaSearchByBBoxListReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/FETCH_ALL_BY_BBOX"]: () => true,
    ["mvj/areaSearch/RECEIVE_ALL_BY_BBOX"]: () => false,
    ["mvj/areaSearch/NOT_FOUND_BY_BBOX"]: () => false,
  },
  false,
);
const currentAreaSearchReducer: Reducer<Record<string, any> | null> =
  handleActions(
    {
      ["mvj/areaSearch/RECEIVE_SINGLE"]: (
        state: Record<string, any>,
        { payload: response }: ReceiveSingleAreaSearchAction,
      ) => {
        return response || null;
      },
      ["mvj/areaSearch/CREATE_SPECS"]: () => null,
      ["mvj/areaSearch/RECEIVE_SPECS_CREATED"]: (state, { payload: result }) =>
        result,
      ["mvj/areaSearch/SET_ATTACHMENTS"]: (state, { payload: attachments }) => {
        const { area_search_attachments } = state;
        return { ...state, area_search_attachments: attachments };
      },
    },
    null,
  );
const isFetchingCurrentAreaSearchReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/FETCH_SINGLE"]: () => true,
    ["mvj/areaSearch/RECEIVE_SINGLE"]: () => false,
    ["mvj/areaSearch/SINGLE_NOT_FOUND"]: () => false,
  },
  false,
);
const collapseStatesReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_COLLAPSE_STATES"]: (
      state: Record<string, any>,
      { payload: states }: ReceiveCollapseStatesAction,
    ) => {
      return merge(state, states);
    },
  },
  {},
);
const isSaveClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_SAVE_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsSaveClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
const isEditModeReducer: Reducer<boolean> = handleActions(
  {
    "mvj/areaSearch/HIDE_EDIT": () => false,
    "mvj/areaSearch/SHOW_EDIT": () => true,
  },
  false,
);
const isFormValidByIdReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/areaSearch/RECEIVE_FORM_VALID_FLAGS"]: (
      state: Record<string, any>,
      { payload: valid }: ReceiveFormValidFlagsAction,
    ) => {
      return { ...state, ...valid };
    },
    ["mvj/areaSearch/CLEAR_FORM_VALID_FLAGS"]: () => {
      return {};
    },
  },
  {},
);
const isBatchEditingAreaSearchInfoChecksReducer: Reducer<boolean> =
  handleActions(
    {
      ["mvj/areaSearch/BATCH_EDIT_INFO_CHECKS"]: () => true,
      ["mvj/areaSearch/RECEIVE_INFO_CHECKS_BATCH_EDIT_SUCCESS"]: () => false,
      ["mvj/areaSearch/RECEIVE_INFO_CHECKS_BATCH_EDIT_FAILURE"]: () => false,
    },
    false,
  );
const isEditingAreaSearchReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/EDIT"]: () => true,
    ["mvj/areaSearch/RECEIVE_EDITED"]: () => false,
    ["mvj/areaSearch/RECEIVE_EDIT_FAILED"]: () => false,
  },
  false,
);
const lastAreaSearchEditErrorReducer: Reducer<any> = handleActions(
  {
    ["mvj/areaSearch/EDIT"]: () => null,
    ["mvj/areaSearch/RECEIVE_EDIT_FAILED"]: (
      state,
      { payload: error }: ReceiveAreaSearchEditFailedAction,
    ) => error,
  },
  null,
);
const isSubmittingAreaSearchSpecsReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/CREATE_SPECS"]: () => true,
    ["mvj/areaSearch/RECEIVE_SPECS_CREATED"]: () => false,
    ["mvj/areaSearch/RECEIVE_SPECS_CREATE_FAILED"]: () => false,
  },
  false,
);
const isSubmittingAreaSearchApplicationReducer: Reducer<boolean> =
  handleActions(
    {
      ["mvj/areaSearch/CREATE_APPLICATION"]: () => true,
      ["mvj/areaSearch/RECEIVE_APPLICATION_CREATED"]: () => false,
      ["mvj/areaSearch/RECEIVE_APPLICATION_CREATE_FAILED"]: () => false,
    },
    false,
  );
const isPerformingFileOperationReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/areaSearch/DELETE_ATTACHMENT"]: () => true,
    ["mvj/areaSearch/UPLOAD_ATTACHMENT"]: () => true,
    ["mvj/areaSearch/RECEIVE_FILE_OPERATION_FINISHED"]: () => false,
    ["mvj/areaSearch/RECEIVE_FILE_OPERATION_FAILED"]: () => false,
  },
  false,
);
const lastFileOperationErrorReducer: Reducer<any> = handleActions(
  {
    ["mvj/areaSearch/DELETE_ATTACHMENT"]: () => null,
    ["mvj/areaSearch/UPLOAD_ATTACHMENT"]: () => null,
    ["mvj/areaSearch/RECEIVE_FILE_OPERATION_FAILED"]: () => false,
  },
  null,
);
export default combineReducers<Record<string, any>, Action<any>>({
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  listAttributes: listAttributesReducer,
  listMethods: listMethodsReducer,
  isFetchingListAttributes: isFetchingListAttributesReducer,
  areaSearchList: areaSearchListReducer,
  isFetchingAreaSearchList: isFetchingAreaSearchListReducer,
  areaSearchListByBBox: areaSearchListByBBoxReducer,
  isFetchingAreaSearchListByBBox: isFetchingAreaSearchByBBoxListReducer,
  currentAreaSearch: currentAreaSearchReducer,
  isFetchingCurrentAreaSearch: isFetchingCurrentAreaSearchReducer,
  isEditMode: isEditModeReducer,
  isFormValidById: isFormValidByIdReducer,
  collapseStates: collapseStatesReducer,
  isSaveClicked: isSaveClickedReducer,
  isBatchEditingAreaSearchInfoChecks: isBatchEditingAreaSearchInfoChecksReducer,
  isSubmittingAreaSearchApplication: isSubmittingAreaSearchApplicationReducer,
  isEditingAreaSearch: isEditingAreaSearchReducer,
  lastAreaSearchEditError: lastAreaSearchEditErrorReducer,
  isSubmittingAreaSearchSpecs: isSubmittingAreaSearchSpecsReducer,
  isPerformingFileOperation: isPerformingFileOperationReducer,
  lastFileOperationError: lastFileOperationErrorReducer,
});
