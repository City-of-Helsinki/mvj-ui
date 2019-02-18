// @flow
import type {Action, Attributes, Methods} from '../types';

export type InfillDevelopmentState = {
  attributes: Attributes,
  collapseStates: Object,
  current: InfillDevelopment,
  initialValues: InfillDevelopment,
  isFormValidById: Object,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  isSaveClicked: boolean,
  isSaving: boolean,
  list: InfillDevelopmentList,
  methods: Methods,
};
export type InfillDevelopmentId = number;
export type InfillDevelopment = Object;
export type InfillDevelopmentList = Object;

export type FetchAttributesAction = Action<'mvj/infillDevelopment/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/infillDevelopment/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/infillDevelopment/RECEIVE_METHODS', Methods>;
export type InfillDevelopmentAttributesNotFoundAction = Action<'mvj/infillDevelopment/ATTRIBUTES_NOT_FOUND', void>;

export type FetchInfillDevelopmentListAction = Action<'mvj/infillDevelopment/FETCH_ALL', Object>;
export type ReceiveInfillDevelopmentListAction = Action<'mvj/infillDevelopment/RECEIVE_ALL', InfillDevelopmentList>;
export type FetchSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/FETCH_SINGLE', InfillDevelopmentId>;
export type ReceiveSingleInfillDevelopmentAction = Action<'mvj/infillDevelopment/RECEIVE_SINGLE', InfillDevelopment>;

export type CreateInfillDevelopmentAction = Action<'mvj/infillDevelopment/CREATE', InfillDevelopment>;
export type EditInfillDevelopmentAction = Action<'mvj/infillDevelopment/EDIT', InfillDevelopment>;

export type InfillDevelopmentNotFoundAction = Action<'mvj/infillDevelopment/NOT_FOUND', void>;

export type HideEditModeAction = Action<'mvj/infillDevelopment/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/infillDevelopment/SHOW_EDIT', void>;
export type ReceiveIsSaveClickedAction = Action<'mvj/infillDevelopment/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/infillDevelopment/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/infillDevelopment/CLEAR_FORM_VALID_FLAGS', void>;

export type ReceiveFormInitialValuesAction = Action<'mvj/infillDevelopment/RECEIVE_INITIAL_VALUES', InfillDevelopment>;

export type ReceiveCollapseStatesAction = Action<'mvj/infillDevelopment/RECEIVE_COLLAPSE_STATES', Object>;
