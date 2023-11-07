// @flow
import merge from 'lodash/merge';
import type {Action, CombinedReducer} from 'redux';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {sortBy} from 'lodash/collection';

import {FormNames} from '$src/enums';

import type {Attributes, Reducer} from '$src/types';
import type {
  InfoCheckBatchEditErrors,
  PlotApplication,
  PlotApplicationsList,
  PlotApplicationsState,
  ReceiveApplicationRelatedFormAction,
  ReceiveApplicationRelatedPlotSearchAction,
  ReceiveCollapseStatesAction,
  ReceiveFormValidFlagsAction,
  ReceiveIsSaveClickedAction,
  ReceivePlotApplicationInfoCheckBatchEditFailureAction,
  ReceivePlotApplicationsByBBoxAction,
  ReceivePlotApplicationsListAction,
  ReceivePlotSearchSubtypesAction,
  ReceiveSinglePlotApplicationAction,
  ReceiveTargetInfoCheckAttributesAction,
  ReceiveTargetInfoChecksForPlotSearchAction,
} from '$src/plotApplications/types';

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

const isSavingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/CREATE']: () => true,
  ['mvj/plotApplications/EDIT']: () => true,
  ['mvj/plotApplications/RECEIVE_SAVED']: () => false,
  ['mvj/plotApplications/RECEIVE_SAVE_FAILED']: () => false,
  ['mvj/plotApplications/BATCH_EDIT_RELATED_MODELS']: () => true,
  ['mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS']: () => false,
  ['mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE']: () => false,
}, false);

const isPerformingFileOperationReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/UPLOAD_MEETING_MEMO']: () => true,
  ['mvj/plotApplications/DELETE_MEETING_MEMO']: () => true,
  ['mvj/plotApplications/RECEIVE_FILE_OPERATION_FINISHED']: () => false,
  ['mvj/plotApplications/RECEIVE_MEETING_MEMO_UPLOADED']: () => false,
}, false);

const currentEditorTargetsReducer: Reducer<Array<Object>> = handleActions({
  ['mvj/plotApplications/SET_CURRENT_EDITOR_TARGETS']: (state, {payload: targets}) => targets || [],
}, []);

const targetInfoCheckAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECK_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveTargetInfoCheckAttributesAction) => attributes,
  ['mvj/plotApplications/TARGET_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingTargetInfoCheckAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_TARGET_INFO_CHECK_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECK_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/TARGET_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => false,
}, false);

const infoCheckBatchEditErrorsReducer: Reducer<InfoCheckBatchEditErrors> = handleActions({
  ['mvj/plotApplications/BATCH_EDIT_RELATED_MODELS']: () => ({
    target: [],
    applicant: [],
  }),
  ['mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_SUCCESS']: () => ({
    target: [],
    applicant: [],
  }),
  ['mvj/plotApplications/RECEIVE_INFO_CHECK_BATCH_EDIT_FAILURE']: (state, {payload}: ReceivePlotApplicationInfoCheckBatchEditFailureAction) => payload,
}, {
  target: [],
  applicant: [],
});

const targetInfoChecksForCurrentPlotSearchReducer: Reducer<Array<Object>> = handleActions({
  ['mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH']: () => [],
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH']:
    (state: Attributes, {payload: infoChecks}: ReceiveTargetInfoChecksForPlotSearchAction) =>
      sortBy(infoChecks, 'application_identifier'),
  ['mvj/plotApplications/TARGET_INFO_CHECKS_FOR_PLOT_SEARCH_NOT_FOUND']: () => [],
}, []);

const isFetchingTargetInfoChecksForCurrentPlotSearchReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH']: () => true,
  ['mvj/plotApplications/RECEIVE_TARGET_INFO_CHECKS_FOR_PLOT_SEARCH']: () => false,
  ['mvj/plotApplications/TARGET_INFO_CHECKS_FOR_PLOT_SEARCH_NOT_FOUND']: () => false,
}, false);

export default (combineReducers<Object, Action<any>>({
  isFetching: isFetchingReducer,
  isFetchingByBBox: isFetchingByBBoxReducer,
  listByBBox: listByBBoxReducer,
  list: plotApplicationsListReducer,
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
  isSaving: isSavingReducer,
  isPerformingFileOperation: isPerformingFileOperationReducer,
  currentEditorTargets: currentEditorTargetsReducer,
  isFetchingTargetInfoCheckAttributes: isFetchingTargetInfoCheckAttributesReducer,
  targetInfoCheckAttributes: targetInfoCheckAttributesReducer,
  infoCheckBatchEditErrors: infoCheckBatchEditErrorsReducer,
  targetInfoChecksForCurrentPlotSearch: targetInfoChecksForCurrentPlotSearchReducer,
  isFetchingTargetInfoChecksForCurrentPlotSearch: isFetchingTargetInfoChecksForCurrentPlotSearchReducer,
}): CombinedReducer<PlotApplicationsState, Action<any>>);
