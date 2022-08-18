// @flow
import type {Action} from '../types';
import type {Attributes, Methods} from '../types';

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
  isSaveClicked: boolean,
  collapseStates: Object,
  isFormValidById: Object,
  subTypes: ?Array<Object>
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

export type EditPlotApplicationAction = Action<'mvj/plotApplications/EDIT', PlotApplication>;

export type FetchPlotSearchSubtypesAction = Action<'mvj/plotApplications/FETCH_PLOT_SEARCH_SUB_TYPES', void>;
export type ReceivePlotSearchSubtypesAction = Action<'mvj/plotApplications/RECEIVE_PLOT_SEARCH_SUB_TYPES', Object>;
export type PlotSearchSubtypesNotFoundAction = Action<'mvj/plotApplications/PLOT_SEARCH_SUB_TYPES_NOT_FOUND', void>;
