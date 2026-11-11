import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash-es";
import type { ApiResponse, Attributes, Methods } from "@/types";
import type {
  AreaSearchState,
  CreateAreaSearchApplicationPayload,
  DeleteAreaSearchAttachmentPayload,
  InfoCheckBatchEditData,
  UploadAreaSearchAttachmentPayload,
  UploadedAreaSearchAttachmentMeta,
} from "./types";

export const initialState: AreaSearchState = {
  attributes: null,
  methods: null,
  isFetchingAttributes: false,
  listAttributes: null,
  listMethods: null,
  isFetchingListAttributes: false,
  areaSearchList: null,
  areaSearchListByBBox: null,
  isFetchingAreaSearchList: false,
  isFetchingAreaSearchListByBBox: false,
  currentAreaSearch: null,
  isFetchingCurrentAreaSearch: false,
  isEditMode: false,
  isSaveClicked: false,
  collapseStates: {},
  isFormValidById: {},
  isBatchEditingAreaSearchInfoChecks: false,
  isEditingAreaSearch: false,
  lastAreaSearchEditError: null,
  isSubmittingAreaSearchSpecs: false,
  isSubmittingAreaSearchApplication: false,
  isPerformingFileOperation: false,
  lastFileOperationError: null,
};

const areaSearchSlice = createSlice({
  name: "mvj/areaSearch",
  initialState,
  reducers: {
    fetchListAttributes: (state) => {
      state.isFetchingListAttributes = true;
    },
    receiveListAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.listAttributes = payload;
      state.isFetchingListAttributes = false;
    },
    receiveListMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.listMethods = payload;
      state.isFetchingListAttributes = false;
    },
    listAttributesNotFound: (state) => {
      state.isFetchingListAttributes = false;
    },
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
      state.isFetchingAttributes = false;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    fetchAreaSearchList: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingAreaSearchList = true;
    },
    fetchAreaSearchListByBBox: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingAreaSearchListByBBox = true;
    },
    receiveAreaSearchList: (state, { payload }: PayloadAction<ApiResponse>) => {
      state.areaSearchList = payload || null;
      state.isFetchingAreaSearchList = false;
    },
    receiveAreaSearchByBBoxList: (
      state,
      { payload }: PayloadAction<ApiResponse>,
    ) => {
      state.areaSearchListByBBox = payload || null;
      state.isFetchingAreaSearchListByBBox = false;
    },
    areaSearchesNotFound: (state) => {
      state.isFetchingAreaSearchList = false;
    },
    areaSearchesByBBoxNotFound: (state) => {
      state.isFetchingAreaSearchListByBBox = false;
    },
    fetchSingleAreaSearch: (state, _action: PayloadAction<number>) => {
      state.isFetchingCurrentAreaSearch = true;
    },
    receiveSingleAreaSearch: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.currentAreaSearch = payload || null;
      state.isFetchingCurrentAreaSearch = false;
    },
    singleAreaSearchNotFound: (state) => {
      state.isFetchingCurrentAreaSearch = false;
    },
    batchEditAreaSearchInfoChecks: (
      state,
      _action: PayloadAction<InfoCheckBatchEditData>,
    ) => {
      state.isBatchEditingAreaSearchInfoChecks = true;
    },
    receiveAreaSearchInfoChecksBatchEditSuccess: (state) => {
      state.isBatchEditingAreaSearchInfoChecks = false;
    },
    receiveAreaSearchInfoChecksBatchEditFailure: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isBatchEditingAreaSearchInfoChecks = false;
    },
    editAreaSearch: (state, _action: PayloadAction<Record<string, any>>) => {
      state.isEditingAreaSearch = true;
      state.lastAreaSearchEditError = null;
    },
    receiveAreaSearchEdited: (state) => {
      state.isEditingAreaSearch = false;
    },
    receiveAreaSearchEditFailed: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.isEditingAreaSearch = false;
      state.lastAreaSearchEditError = payload;
    },
    createAreaSearchSpecs: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.currentAreaSearch = null;
      state.isSubmittingAreaSearchSpecs = true;
    },
    receiveAreaSearchSpecsCreated: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.currentAreaSearch = payload;
      state.isSubmittingAreaSearchSpecs = false;
    },
    receiveAreaSearchSpecsCreateFailed: (state) => {
      state.isSubmittingAreaSearchSpecs = false;
    },
    createAreaSearchApplication: (
      state,
      _action: PayloadAction<CreateAreaSearchApplicationPayload>,
    ) => {
      state.isSubmittingAreaSearchApplication = true;
    },
    receiveAreaSearchApplicationCreated: (state) => {
      state.isSubmittingAreaSearchApplication = false;
    },
    receiveAreaSearchApplicationCreateFailed: (state) => {
      state.isSubmittingAreaSearchApplication = false;
    },
    deleteUploadedAttachment: (
      state,
      _action: PayloadAction<DeleteAreaSearchAttachmentPayload>,
    ) => {
      state.isPerformingFileOperation = true;
      state.lastFileOperationError = null;
    },
    uploadAttachment: (
      state,
      _action: PayloadAction<UploadAreaSearchAttachmentPayload>,
    ) => {
      state.isPerformingFileOperation = true;
      state.lastFileOperationError = null;
    },
    receiveFileOperationFinished: (state) => {
      state.isPerformingFileOperation = false;
    },
    receiveFileOperationFailed: (state, _action: PayloadAction<any>) => {
      state.isPerformingFileOperation = false;
      state.lastFileOperationError = _action.payload;
    },
    setAreaSearchAttachments: (
      state,
      { payload }: PayloadAction<Array<UploadedAreaSearchAttachmentMeta>>,
    ) => {
      if (state.currentAreaSearch) {
        state.currentAreaSearch.area_search_attachments = payload;
      }
    },
    showEditMode: (state) => {
      state.isEditMode = true;
    },
    hideEditMode: (state) => {
      state.isEditMode = false;
    },
    receiveCollapseStates: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.collapseStates = merge({}, state.collapseStates, payload);
    },
    receiveIsSaveClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isSaveClicked = payload;
    },
    receiveFormValidFlags: (
      state,
      { payload }: PayloadAction<Record<string, any>>,
    ) => {
      state.isFormValidById = { ...state.isFormValidById, ...payload };
    },
    clearFormValidFlags: (state) => {
      state.isFormValidById = {};
    },
  },
});

export const {
  fetchListAttributes,
  receiveListAttributes,
  receiveListMethods,
  listAttributesNotFound,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchAreaSearchList,
  fetchAreaSearchListByBBox,
  receiveAreaSearchList,
  receiveAreaSearchByBBoxList,
  areaSearchesNotFound,
  areaSearchesByBBoxNotFound,
  fetchSingleAreaSearch,
  receiveSingleAreaSearch,
  singleAreaSearchNotFound,
  batchEditAreaSearchInfoChecks,
  receiveAreaSearchInfoChecksBatchEditSuccess,
  receiveAreaSearchInfoChecksBatchEditFailure,
  editAreaSearch,
  receiveAreaSearchEdited,
  receiveAreaSearchEditFailed,
  createAreaSearchSpecs,
  receiveAreaSearchSpecsCreated,
  receiveAreaSearchSpecsCreateFailed,
  createAreaSearchApplication,
  receiveAreaSearchApplicationCreated,
  receiveAreaSearchApplicationCreateFailed,
  deleteUploadedAttachment,
  uploadAttachment,
  receiveFileOperationFinished,
  receiveFileOperationFailed,
  setAreaSearchAttachments,
  showEditMode,
  hideEditMode,
  receiveCollapseStates,
  receiveIsSaveClicked,
  receiveFormValidFlags,
  clearFormValidFlags,
} = areaSearchSlice.actions;

export default areaSearchSlice.reducer;
