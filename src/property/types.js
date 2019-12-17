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
};

export type PropertyId = number;
export type Property = Object;
export type PropertyList = Object;

export type FetchAttributesAction = Action<'mvj/property/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/property/RECEIVE_ATTRIBUTES', Attributes>;

export type CreatePropertyAction = Action<'mvj/property/CREATE', Property>;
export type EditPropertyAction = Action<'mvj/property/EDIT', Property>;
// TODO NOT FOUND

export type ReceiveIsSaveClickedAction = Action<'mvj/property/RECEIVE_SAVE_CLICKED', boolean>;

export type FetchPropertyListAction = Action<'mvj/property/FETCH_ALL', string>;
export type ReceivePropertyListAction = Action<'mvj/property/RECEIVE_ALL', PropertyList>;
export type FetchSinglePropertyAction = Action<'mvj/property/FETCH_SINGLE', PropertyId>;
export type ReceiveSinglePropertyAction = Action<'mvj/property/RECEIVE_SINGLE', Property>;

export type HideEditModeAction = Action<'mvj/property/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/property/SHOW_EDIT', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/property/RECEIVE_COLLAPSE_STATES', Object>;
