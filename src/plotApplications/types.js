// @flow
import type {Action, Attributes, Methods} from '../types';
import type {PlotSearch} from '../plotSearch/types';

export type PlotApplicationsState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PlotApplicationsList,
  methods: Object,
  current: PlotApplication,
  isFetchingByBBox: boolean,
  listByBBox: PlotApplicationsList,
  isEditMode: boolean,
  isSaving: boolean,
  collapseStates: Object,
  isFormValidById: Object,
  subTypes: ?Array<Object>,
  isFetchingSubTypes: boolean,
  isFetchingAttachments: boolean,
  fieldTypeMapping: { [id: number]: string },
  pendingUploads: Array<Object>,
  isFetchingPendingUploads: boolean,
  isPerformingFileOperation: boolean,
  attachmentAttributes: Attributes,
  attachmentMethods: Methods,
  isFetchingAttachmentAttributes: boolean,
  attachments: ?Array<Object>,
  currentEditorTargets: Array<Object>,
  isFetchingInfoCheckAttributes: boolean,
  infoCheckAttributes: Attributes,
  isUpdatingInfoCheck: { [id: number]: boolean },
  lastInfoCheckUpdateSuccessful: { [id: number]: boolean },
  isSaveClicked: boolean,
  isFetchingForm: boolean,
  form: ?Object,
  isFetchingPlotSearch: boolean,
  plotSearch: ?PlotSearch
};

export type PlotApplicationFormValue = string | Array<string> | Array<UploadedFileMeta> | boolean;

export type PlotApplicationsList = Object;
export type PlotApplication = Object;

export type ApplicationFormField = {
  value: PlotApplicationFormValue | null,
  extraValue: string
}

export type ApplicationFormSection = {
  fields: { [identifier: string]: ApplicationFormField},
  sections: { [identifier: string]: ApplicationFormSection | Array<ApplicationFormSection> },
  metadata?: { [key: string]: mixed },
  sectionRestrictions: { [identifier: string]: string }
}

export type ApplicationFormState = {
  formId: number | null,
  targets: Array<number>,
  formEntries: { [identifier: string]: ApplicationFormSection } | null
}

export type SavedApplicationFormField = {
  value: PlotApplicationFormValue | null,
  extra_value: string
}

export type SavedApplicationFormSection = {
  fields: { [identifier: string]: SavedApplicationFormField},
  sections: { [identifier: string]: SavedApplicationFormSection | Array<SavedApplicationFormSection> },
  metadata?: { [key: string]: mixed },
}

export type UploadedFileMeta = {
  id: number;
  attachment: string;
  name: string;
  field: number;
  created_at: string;
  answer: number | null;
};

export type FetchAttributesAction = Action<'mvj/plotApplications/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/plotApplications/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/plotApplications/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/plotApplications/ATTRIBUTES_NOT_FOUND', void>;

export type FetchPlotApplicationsListAction = Action<'mvj/plotApplications/FETCH_ALL', string>;
export type ReceivePlotApplicationsListAction = Action<'mvj/plotApplications/RECEIVE_ALL', PlotApplicationsList>;
export type ApplicationsNotFoundAction = Action<'mvj/plotApplications/APPLICATIONS_NOT_FOUND', void>;
export type FetchPlotApplicationsByBBoxAction = Action<'mvj/plotApplications/FETCH_BY_BBOX', Object>;
export type ReceivePlotApplicationsByBBoxAction = Action<'mvj/plotApplications/RECEIVE_BY_BBOX', PlotApplicationsList>;
export type NotFoundByBBoxAction = Action<'mvj/plotApplications/NOT_FOUND_BY_BBOX', void>;

export type FetchSinglePlotApplicationAction = Action<'mvj/plotApplications/FETCH_SINGLE', number>;
export type ReceiveSinglePlotApplicationAction = Action<'mvj/plotApplications/RECEIVE_SINGLE', PlotApplication>;

export type HideEditModeAction = Action<'mvj/plotApplications/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/plotApplications/SHOW_EDIT', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/plotApplications/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/plotApplications/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/plotApplications/RECEIVE_COLLAPSE_STATES', Object>;

export type CreatePlotApplicationAction = Action<'mvj/plotApplications/CREATE', PlotApplication>;
export type EditPlotApplicationAction = Action<'mvj/plotApplications/EDIT', PlotApplication>;
export type ReceivePlotApplicationSavedAction = Action<'mvj/plotApplications/RECEIVE_SAVED', number>;
export type ReceivePlotApplicationSaveFailedAction = Action<'mvj/plotApplications/RECEIVE_SAVE_FAILED', void>;

export type FetchPlotSearchSubtypesAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypesAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypesNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;

export type FetchApplicationRelatedFormAction = Action<'mvj/plotApplications/FETCH_FORM', void>;
export type ReceiveApplicationRelatedFormAction = Action<'mvj/plotApplications/RECEIVE_FORM', Object>;
export type ApplicationRelatedFormNotFoundAction = Action<'mvj/plotApplications/FORM_NOT_FOUND', void>;

export type FetchApplicationRelatedPlotSearchAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH', void>;
export type ReceiveApplicationRelatedPlotSearchAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH', Object>;
export type ApplicationRelatedPlotSearchNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_NOT_FOUND', void>;

export type FetchApplicationRelatedAttachmentsAction = Action<'mvj/plotApplications/FETCH_ATTACHMENTS', void>;
export type ReceiveApplicationRelatedAttachmentsAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENTS', Object>;
export type ApplicationRelatedAttachmentsNotFoundAction = Action<'mvj/plotApplications/ATTACHMENTS_NOT_FOUND', void>;

export type InitializeFormEntriesForApplicationAction = Action<'mvj/plotApplications/INITIALIZE_FORM_ENTRIES', number>;

export type FetchPendingUploadsAction = Action<'mvj/plotApplications/FETCH_PENDING_UPLOADS', void>;
export type ReceivePendingUploadsAction = Action<'mvj/plotApplications/RECEIVE_PENDING_UPLOADS', Object>;
export type PendingUploadsNotFoundAction = Action<'mvj/plotApplications/PENDING_UPLOADS_NOT_FOUND', void>;
export type DeleteUploadAction = Action<'mvj/plotApplications/DELETE_UPLOAD', Object>;
export type UploadFileAction = Action<'mvj/plotApplications/UPLOAD_FILE', Object>;
export type ReceiveFileOperationFinishedAction = Action<'mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED', void>;

export type FetchAttachmentAttributesAction = Action<'mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES', void>;
export type ReceiveAttachmentAttributesAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES', Attributes>;
export type ReceiveAttachmentMethodsAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS', Methods>;
export type AttachmentAttributesNotFoundAction = Action<'mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND', void>;

export type SetCurrentEditorTargetsAction = Action<'mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS', Array<Object>>;

export type FetchInfoCheckAttributesAction = Action<'mvj/plotApplications/FETCH_INFO_CHECK_ATTRIBUTES', void>;
export type ReceiveInfoCheckAttributesAction = Action<'mvj/plotApplications/RECEIVE_INFO_CHECK_ATTRIBUTES', Attributes>;
export type InfoCheckAttributesNotFoundAction = Action<'mvj/plotApplications/INFO_CHECK_ATTRIBUTES_NOT_FOUND', void>;
export type EditInfoCheckItemAction = Action<'mvj/plotApplications/EDIT_INFO_CHECK_ITEM', Object>;
export type ReceiveUpdatedInfoCheckItemAction = Action<'mvj/plotApplications/RECEIVE_UPDATED_INFO_CHECK_ITEM', Object>;
export type InfoCheckUpdateFailed = Action<'mvj/plotApplications/INFO_CHECK_UPDATE_FAILED', number>;
