// @flow
import type {Action, Attributes} from '../types';

export type PropertyState = {
  attributes: Attributes,
  current: Property,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: PropertyList,
  collapseStates: Object,
  isSaveClicked: boolean,
  isFormValidById: Object,
};

export type PropertyId = number;
export type Property = Object;
export type PropertyList = Object;

export type FetchAttributesAction = Action<'mvj/property/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/property/RECEIVE_ATTRIBUTES', Attributes>;

export type CreatePropertyAction = Action<'mvj/property/CREATE', Property>;
export type EditPropertyAction = Action<'mvj/property/EDIT', Property>;
export type PropertyNotFoundAction = Action<'mvj/property/NOT_FOUND', void>;

export type ReceiveIsSaveClickedAction = Action<'mvj/property/RECEIVE_SAVE_CLICKED', boolean>;
export type ReceiveFormValidFlagsAction = Action<'mvj/property/RECEIVE_FORM_VALID_FLAGS', Object>;
export type ClearFormValidFlagsAction = Action<'mvj/property/CLEAR_FORM_VALID_FLAGS', void>;

export type FetchPropertyListAction = Action<'mvj/property/FETCH_ALL', string>;
export type ReceivePropertyListAction = Action<'mvj/property/RECEIVE_ALL', PropertyList>;
export type FetchSinglePropertyAction = Action<'mvj/property/FETCH_SINGLE', PropertyId>;
export type ReceiveSinglePropertyAction = Action<'mvj/property/RECEIVE_SINGLE', Property>;

export type HideEditModeAction = Action<'mvj/property/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/property/SHOW_EDIT', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/property/RECEIVE_COLLAPSE_STATES', Object>;
