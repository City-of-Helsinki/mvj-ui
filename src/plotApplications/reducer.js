// @flow
import merge from 'lodash/merge';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import type {Action, CombinedReducer} from 'redux';

import type {Attributes, Reducer, Methods} from '$src/types';
import {FormNames} from '$src/enums';

import type {
  ReceivePlotApplicationsListAction,
  PlotApplicationsList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveSinglePlotApplicationAction,
  PlotApplication,
  ReceiveIsSaveClickedAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceivePlotApplicationsByBBoxAction,
  ReceiveApplicationRelatedFormAction,
  ReceiveApplicationRelatedAttachmentsAction,
  ReceivePlotSearchSubtypesAction,
  ReceiveApplicationRelatedPlotSearchAction,
  ReceiveAttachmentAttributesAction,
  ReceiveAttachmentMethodsAction,
  ReceiveApplicantInfoCheckAttributesAction,
  PlotApplicationsState,
} from '$src/plotApplications/types';
import type {ReceiveFormAttributesAction} from '$src/plotSearch/types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ALL']: () => true,
  ['mvj/plotApplications/RECEIVE_ALL']: () => false,
  ['mvj/plotApplications/FETCH_SINGLE']: () => true,
  ['mvj/plotApplications/RECEIVE_SINGLE']: () => false,
  ['mvj/plotApplications/EDIT']: () => true,
  ['mvj/plotApplications/RECEIVE_SAVED']: () => false,
  ['mvj/plotApplications/APPLICATIONS_NOT_FOUND']: () => false,
}, false);

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/plotApplications/HIDE_EDIT': () => false,
  'mvj/plotApplications/SHOW_EDIT': () => true,
}, false);

const isFetchingByBBoxReducer: Reducer<boolean> = handleActions({
  'mvj/plotApplications/FETCH_BY_BBOX': () => true,
  'mvj/plotApplications/NOT_FOUND_BY_BBOX': () => false,
  'mvj/plotApplications/RECEIVE_BY_BBOX': () => false,
}, false);

const listByBBoxReducer: Reducer<PlotApplicationsList> = handleActions({
  ['mvj/plotApplications/RECEIVE_BY_BBOX']: (state: PlotApplicationsList, {payload: plotApplications}: ReceivePlotApplicationsByBBoxAction) => {
    return plotApplications;
  },
}, null);

const plotApplicationsListReducer: Reducer<PlotApplicationsList> = handleActions({
  ['mvj/plotApplications/RECEIVE_ALL']: (state: PlotApplicationsList, {payload: list}: ReceivePlotApplicationsListAction) => list,
}, {});

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotApplications/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotApplications/RECEIVE_METHODS']: () => false,
}, false);

const currentPlotApplicationReducer: Reducer<PlotApplication> = handleActions({
  ['mvj/plotApplications/RECEIVE_SINGLE']: (state: PlotApplication, {payload: plotApplications}: ReceiveSinglePlotApplicationAction) => plotApplications,
}, {});

const isSaveClickedReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/RECEIVE_SAVE_CLICKED']: (state: boolean, {payload: isClicked}: ReceiveIsSaveClickedAction) => {
    return isClicked;
  },
}, false);

const collapseStatesReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/RECEIVE_COLLAPSE_STATES']: (state: Object, {payload: states}: ReceiveCollapseStatesAction) => {
    return merge(state, states);
  },
}, {});

const isFormValidByIdReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/RECEIVE_FORM_VALID_FLAGS']: (state: Object, {payload: valid}: ReceiveFormValidFlagsAction) => {
    return {
      ...state,
      ...valid,
    };
  },
  ['mvj/plotApplications/CLEAR_FORM_VALID_FLAGS']: () => {
    return {
      [FormNames.PLOT_APPLICATION]: true,
    };
  },
}, {
  [FormNames.PLOT_APPLICATION]: true,
});

const subTypesReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES']: (state: Object, {payload: subTypes}: ReceivePlotSearchSubtypesAction) => {
    return subTypes;
  },
}, null);

const isFetchingSubTypesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES']: () => true,
  ['mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES']: () => false,
  ['mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND']: () => false,
}, false);

const formReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/FETCH_FORM']: () => null,
  ['mvj/plotApplications/RECEIVE_FORM']: (state: Object, {payload: form}: ReceiveApplicationRelatedFormAction) => {
    return form;
  },
}, null);

const plotSearchReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/FETCH_PLOT_SEARCH']: () => null,
  ['mvj/plotApplications/RECEIVE_PLOT_SEARCH']: (state: Object, {payload: plotSearch}: ReceiveApplicationRelatedPlotSearchAction) => {
    return plotSearch;
  },
}, null);

const isFetchingFormReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_FORM']: () => true,
  ['mvj/plotApplications/RECEIVE_FORM']: () => false,
  ['mvj/plotApplications/FORM_NOT_FOUND']: () => false,
}, false);

const isFetchingPlotSearchReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_PLOT_SEARCH']: () => true,
  ['mvj/plotApplications/RECEIVE_PLOT_SEARCH']: () => false,
  ['mvj/plotApplications/PLOT_SEARCH_NOT_FOUND']: () => false,
}, false);

const attachmentReducer: Reducer<Object> = handleActions({
  ['mvj/plotApplications/FETCH_ATTACHMENTS']: () => null,
  ['mvj/plotApplications/RECEIVE_ATTACHMENTS']: (state: Object, {payload: attachments}: ReceiveApplicationRelatedAttachmentsAction) => {
    return attachments;
  },
}, null);

const isFetchingAttachmentsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTACHMENTS']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTACHMENTS']: () => false,
  ['mvj/plotApplications/ATTACHMENTS_NOT_FOUND']: () => false,
}, false);

const fieldTypeMappingReducer: Reducer<{ [id: number]: string }> = handleActions({
  ['mvj/plotSearch/RECEIVE_FORM_ATTRIBUTES']: (state: { [id: number]: string }, {payload: attributes}: ReceiveFormAttributesAction) => {
    return attributes?.sections?.child?.children.fields?.child?.children.type?.choices?.reduce(
      (acc, choice) => {
        acc[choice.value] = choice.display_name;
        return acc;
      },
      {}
    ) || {};
  },
}, {});

const isSavingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/CREATE']: () => true,
  ['mvj/plotApplications/EDIT']: () => true,
  ['mvj/plotApplications/RECEIVE_SAVED']: () => false,
  ['mvj/plotApplications/RECEIVE_SAVE_FAILED']: () => false,
}, false);

const pendingUploadsReducer: Reducer<Array<Object>> = handleActions({
  ['mvj/plotApplications/FETCH_PENDING_UPLOADS']: () => [],
  ['mvj/plotApplications/RECEIVE_PENDING_UPLOADS']: (state, {payload}) => payload,
}, []);

const isFetchingPendingUploadsReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_PENDING_UPLOADS']: () => true,
  ['mvj/plotApplications/RECEIVE_PENDING_UPLOADS']: () => false,
  ['mvj/plotApplications/PENDING_UPLOADS_NOT_FOUND']: () => false,
}, false);

const isPerformingFileOperationReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/UPLOAD_FILE']: () => true,
  ['mvj/plotApplications/DELETE_UPLOAD']: () => true,
  ['mvj/plotApplications/UPLOAD_MEETING_MEMO']: () => true,
  ['mvj/plotApplications/DELETE_MEETING_MEMO']: () => true,
  ['mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED']: () => false,
  ['mvj/plotApplications/RECEIVE_MEETING_MEMO_UPLOADED']: () => false,
}, false);

const attachmentAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttachmentAttributesAction) => attributes,
  ['mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const attachmentMethodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS']: (state: Methods, {payload: methods}: ReceiveAttachmentMethodsAction) => methods,
  ['mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingAttachmentAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTACHMENT_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTACHMENT_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/ATTACHMENT_ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotApplications/RECEIVE_ATTACHMENT_METHODS']: () => false,
}, false);

const currentEditorTargetsReducer: Reducer<Array<Object>> = handleActions({
  ['mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS']: (state, {payload: targets}) => targets,
}, []);

const applicantInfoCheckAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveApplicantInfoCheckAttributesAction) => attributes,
  ['mvj/plotApplications/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingApplicantInfoCheckAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => false,
}, false);

const isUpdatingApplicantInfoCheckReducer: Reducer<{ [id: number]: boolean }> = handleActions({
  ['mvj/plotApplications/EDIT_APPLICANT_INFO_CHECK_ITEM']: (state: { [id: number]: boolean }, {payload}) => {
    return {
      ...state,
      [payload.id]: true,
    };
  },
  ['mvj/plotApplications/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM']: (state: { [id: number]: boolean }, {payload}) => {
    return {
      ...state,
      [payload.id]: false,
    };
  },
  ['mvj/plotApplications/APPLICANT_INFO_CHECK_UPDATE_FAILED']: (state: { [id: number]: boolean }, {payload: id}) => {
    return {
      ...state,
      [id]: false,
    };
  },
}, {});

const lastApplicantInfoCheckUpdateSuccessfulReducer: Reducer<{ [id: number]: (boolean | null) }> = handleActions({
  ['mvj/plotApplications/EDIT_APPLICANT_INFO_CHECK_ITEM']: (state: { [id: number]: boolean | null }, {payload}) => {
    return {
      ...state,
      [payload.id]: null,
    };
  },
  ['mvj/plotApplications/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM']: (state: { [id: number]: boolean | null }, {payload}) => {
    return {
      ...state,
      [payload.id]: true,
    };
  },
  ['mvj/plotApplications/APPLICANT_INFO_CHECK_UPDATE_FAILED']: (state: { [id: number]: boolean | null }, {payload: id}) => {
    return {
      ...state,
      [id]: false,
    };
  },
}, {});

const targetInfoCheckAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECK_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveApplicantInfoCheckAttributesAction) => attributes,
  ['mvj/plotApplications/TARGET_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingTargetInfoCheckAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_TARGET_INFO_CHECK_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECK_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/TARGET_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => false,
}, false);

const isUpdatingTargetInfoCheckReducer: Reducer<{ [id: number]: boolean }> = handleActions({
  ['mvj/plotApplications/EDIT_TARGET_INFO_CHECK_ITEM']: (state: { [id: number]: boolean }, {payload}) => {
    return {
      ...state,
      [payload.id]: true,
    };
  },
  ['mvj/plotApplications/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM']: (state: { [id: number]: boolean }, {payload}) => {
    return {
      ...state,
      [payload.id]: false,
    };
  },
  ['mvj/plotApplications/TARGET_INFO_CHECK_UPDATE_FAILED']: (state: { [id: number]: boolean }, {payload: id}) => {
    return {
      ...state,
      [id]: false,
    };
  },
}, {});

const lastTargetInfoCheckUpdateSuccessfulReducer: Reducer<{ [id: number]: (boolean | null) }> = handleActions({
  ['mvj/plotApplications/EDIT_TARGET_INFO_CHECK_ITEM']: (state: { [id: number]: boolean | null }, {payload}) => {
    return {
      ...state,
      [payload.id]: null,
    };
  },
  ['mvj/plotApplications/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM']: (state: { [id: number]: boolean | null }, {payload}) => {
    return {
      ...state,
      [payload.id]: true,
    };
  },
  ['mvj/plotApplications/TARGET_INFO_CHECK_UPDATE_FAILED']: (state: { [id: number]: boolean | null }, {payload: id}) => {
    return {
      ...state,
      [id]: false,
    };
  },
}, {});

export default (combineReducers<Object, Action<any>>({
  isFetching: isFetchingReducer,
  isFetchingByBBox: isFetchingByBBoxReducer,
  listByBBox: listByBBoxReducer,
  list: plotApplicationsListReducer,
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  current: currentPlotApplicationReducer,
  isEditMode: isEditModeReducer,
  isSaveClicked: isSaveClickedReducer,
  collapseStates: collapseStatesReducer,
  isFormValidById: isFormValidByIdReducer,
  isFetchingSubTypes: isFetchingSubTypesReducer,
  subTypes: subTypesReducer,
  form: formReducer,
  plotSearch: plotSearchReducer,
  isFetchingForm: isFetchingFormReducer,
  isFetchingPlotSearch: isFetchingPlotSearchReducer,
  attachments: attachmentReducer,
  isFetchingAttachments: isFetchingAttachmentsReducer,
  fieldTypeMapping: fieldTypeMappingReducer,
  isSaving: isSavingReducer,
  pendingUploads: pendingUploadsReducer,
  isFetchingPendingUploads: isFetchingPendingUploadsReducer,
  isPerformingFileOperation: isPerformingFileOperationReducer,
  isFetchingAttachmentAttributes: isFetchingAttachmentAttributesReducer,
  attachmentAttributes: attachmentAttributesReducer,
  attachmentMethods: attachmentMethodsReducer,
  currentEditorTargets: currentEditorTargetsReducer,
  isFetchingApplicantInfoCheckAttributes: isFetchingApplicantInfoCheckAttributesReducer,
  applicantInfoCheckAttributes: applicantInfoCheckAttributesReducer,
  isUpdatingApplicantInfoCheck: isUpdatingApplicantInfoCheckReducer,
  lastApplicantInfoCheckUpdateSuccessful: lastApplicantInfoCheckUpdateSuccessfulReducer,
  isFetchingTargetInfoCheckAttributes: isFetchingTargetInfoCheckAttributesReducer,
  targetInfoCheckAttributes: targetInfoCheckAttributesReducer,
  isUpdatingTargetInfoCheck: isUpdatingTargetInfoCheckReducer,
  lastTargetInfoCheckUpdateSuccessful: lastTargetInfoCheckUpdateSuccessfulReducer,
}): CombinedReducer<PlotApplicationsState, Action<any>>);
