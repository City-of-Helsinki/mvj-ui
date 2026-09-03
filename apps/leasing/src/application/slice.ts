import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "types";
import type { ApplicationState, UploadAttachmentPayload } from "./types";

export const initialState: ApplicationState = {
  attributes: null,
  methods: null,
  isFetchingAttributes: false,
  applicantInfoCheckAttributes: null,
  attachmentAttributes: null,
  attachmentMethods: null,
  isFetchingAttachmentAttributes: false,
  isFetchingApplicantInfoCheckAttributes: false,
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
  formAttributes: null,
  pendingUploads: [],
  isFetchingPendingUploads: false,
  applicationAttachments: null,
  isFetchingApplicationAttachments: false,
  isPerformingFileOperation: false,
};

const applicationSlice = createSlice({
  name: "mvj/application",
  initialState,
  reducers: {
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },

    receiveAttributes: (state, action: PayloadAction<Attributes>) => {
      state.isFetchingAttributes = false;
      state.attributes = action.payload;
    },

    receiveMethods: (state, action: PayloadAction<Methods>) => {
      state.isFetchingAttributes = false;
      state.methods = action.payload;
    },

    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },

    fetchApplicantInfoCheckAttributes: (state) => {
      state.isFetchingApplicantInfoCheckAttributes = true;
    },

    receiveApplicantInfoCheckAttributes: (
      state,
      action: PayloadAction<Attributes>,
    ) => {
      state.isFetchingApplicantInfoCheckAttributes = false;
      state.applicantInfoCheckAttributes = action.payload;
    },

    applicantInfoCheckAttributesNotFound: (state) => {
      state.isFetchingApplicantInfoCheckAttributes = false;
      state.applicantInfoCheckAttributes = null;
    },

    receiveUpdatedApplicantInfoCheckItem: (
      _state,
      _action: PayloadAction<Record<string, any>>,
    ) => {},

    receiveUpdatedTargetInfoCheckItem: (
      _state,
      _action: PayloadAction<Record<string, any>>,
    ) => {},

    fetchFormAttributes: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingFormAttributes = true;
    },

    receiveFormAttributes: (state, action: PayloadAction<Attributes>) => {
      state.isFetchingFormAttributes = false;
      state.formAttributes = action.payload;
      state.fieldTypeMapping =
        action.payload?.sections?.child?.children.fields?.child?.children.type?.choices?.reduce(
          (
            acc: Record<number, string>,
            choice: { value: number; display_name: string },
          ) => {
            acc[choice.value] = choice.display_name;
            return acc;
          },
          {},
        ) || {};
    },

    formAttributesNotFound: (state) => {
      state.isFetchingFormAttributes = false;
    },

    fetchAttachmentAttributes: (state) => {
      state.isFetchingAttachmentAttributes = true;
    },

    receiveAttachmentAttributes: (state, action: PayloadAction<Attributes>) => {
      state.isFetchingAttachmentAttributes = false;
      state.attachmentAttributes = action.payload;
    },

    receiveAttachmentMethods: (state, action: PayloadAction<Methods>) => {
      state.isFetchingAttachmentAttributes = false;
      state.attachmentMethods = action.payload;
    },

    attachmentAttributesNotFound: (state) => {
      state.isFetchingAttachmentAttributes = false;
      state.attachmentAttributes = null;
      state.attachmentMethods = null;
    },

    fetchApplicationRelatedAttachments: (
      state,
      _action: PayloadAction<number | null | undefined>,
    ) => {
      state.isFetchingApplicationAttachments = true;
      state.applicationAttachments = null;
    },

    receiveApplicationRelatedAttachments: (
      state,
      action: PayloadAction<Array<Record<string, any>>>,
    ) => {
      state.isFetchingApplicationAttachments = false;
      state.applicationAttachments = action.payload;
    },

    applicationRelatedAttachmentsNotFound: (state) => {
      state.isFetchingApplicationAttachments = false;
    },

    uploadAttachment: (
      state,
      _action: PayloadAction<UploadAttachmentPayload>,
    ) => {
      state.isPerformingFileOperation = true;
    },

    deleteUploadedAttachment: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isPerformingFileOperation = true;
    },

    receiveFileOperationFinished: (state) => {
      state.isPerformingFileOperation = false;
    },

    fetchPendingUploads: (state) => {
      state.isFetchingPendingUploads = true;
      state.pendingUploads = [];
    },

    receivePendingUploads: (
      state,
      action: PayloadAction<Array<Record<string, any>>>,
    ) => {
      state.isFetchingPendingUploads = false;
      state.pendingUploads = action.payload;
    },

    pendingUploadsNotFound: (state) => {
      state.isFetchingPendingUploads = false;
    },
  },
});

export const {
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  fetchApplicantInfoCheckAttributes,
  receiveApplicantInfoCheckAttributes,
  applicantInfoCheckAttributesNotFound,
  receiveUpdatedApplicantInfoCheckItem,
  receiveUpdatedTargetInfoCheckItem,
  fetchFormAttributes,
  receiveFormAttributes,
  formAttributesNotFound,
  fetchAttachmentAttributes,
  receiveAttachmentAttributes,
  receiveAttachmentMethods,
  attachmentAttributesNotFound,
  fetchApplicationRelatedAttachments,
  receiveApplicationRelatedAttachments,
  applicationRelatedAttachmentsNotFound,
  uploadAttachment,
  deleteUploadedAttachment,
  receiveFileOperationFinished,
  fetchPendingUploads,
  receivePendingUploads,
  pendingUploadsNotFound,
} = applicationSlice.actions;
export default applicationSlice.reducer;
