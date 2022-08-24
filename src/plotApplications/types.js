// @flow
import type {Action, Attributes, Methods} from '../types';

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
  isFetchingAttachments: boolean,
  fieldTypeMapping: Object,
  pendingUploads: Array<Object>,
  isFetchingPendingUploads: boolean,
  isPerformingFileOperation: boolean,
  attachmentAttributes: Attributes,
  attachmentMethods: Methods,
  isFetchingAttachmentAttributes: boolean,
  attachments: ?Array<Object>,
};

export type PlotApplicationsList = Object;
export type PlotApplication = Object;

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
export type ReceivePlotApplicationSavedAction = Action<'mvj/plotApplications/RECEIVE_SAVED', void>;
export type ReceivePlotApplicationSaveFailedAction = Action<'mvj/plotApplications/RECEIVE_SAVE_FAILED', void>;

export type FetchPlotSearchSubtypesAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypesAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypesNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;

export type FetchApplicationRelatedFormAction = Action<'mvj/plotApplications/FETCH_FORM', void>;
export type ReceiveApplicationRelatedFormAction = Action<'mvj/plotApplications/RECEIVE_FORM', Object>;
export type ApplicationRelatedFormNotFoundAction = Action<'mvj/plotApplications/FORM_NOT_FOUND', void>;

export type FetchApplicationRelatedAttachmentsAction = Action<'mvj/plotApplications/FETCH_ATTACHMENTS', void>;
export type ReceiveApplicationRelatedAttachmentsAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENTS', Object>;
export type ApplicationRelatedAttachmentsNotFoundAction = Action<'mvj/plotApplications/ATTACHMENTS_NOT_FOUND', void>;

export type InitializeFormEntriesForApplicationAction = Action<'mvj/plotApplications/INITIALIZE_FORM_ENTRIES', number>;

export type FetchPendingUploadsAction = Action<'mvj/plotApplications/FETCH_PENDING_UPLOADS', void>;
export type ReceivePendingUploadsAction = Action<'mvj/plotApplications/RECEIVE_PENDING_UPLOADS', Object>;
export type PendingUploadsNotFoundAction = Action<'mvj/plotApplications/PENDING_UPLOADS_NOT_FOUND', void>;
export type DeleteUploadAction = Action<'mvj/plotApplications/DELETE_UPLOAD', void>;
export type UploadFileAction = Action<'mvj/plotApplications/UPLOAD_FILE', void>;
export type ReceiveFileOperationFinishedAction = Action<'mvj/plotApplications/FILE_OPERATION_FINISHED', void>;

export type FetchAttachmentAttributesAction = Action<'mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES', void>;
export type ReceiveAttachmentAttributesAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES', Attributes>;
export type ReceiveAttachmentMethodsAction = Action<'mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS', Methods>;
export type AttachmentAttributesNotFoundAction = Action<'mvj/plotApplications/ATTACHMENT_METHODS_NOT_FOUND', void>;
