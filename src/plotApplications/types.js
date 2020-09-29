// @flow
import type {Action} from '../types';
import type {Attributes, Methods} from '../types';

export type PlotApplicationsState = {
  attributes: Attributes,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PlotApplicationsList,
  methods: Object,
};

export type PlotApplicationsList = Object;

export type FetchAttributesAction = Action<'mvj/plotApplications/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/plotApplications/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/plotApplications/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/plotApplications/ATTRIBUTES_NOT_FOUND', void>;

export type FetchPlotApplicationsListAction = Action<'mvj/plotApplications/FETCH_ALL', string>;
export type ReceivePlotApplicationsListAction = Action<'mvj/plotApplications/RECEIVE_ALL', PlotApplicationsList>;
