// @flow
import type {Action} from '../types';

export type PropertyState = {
  isEditMode: boolean,
  collapseStates: Object,
};

export type HideEditModeAction = Action<'mvj/property/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/property/SHOW_EDIT', void>;

export type ReceiveCollapseStatesAction = Action<'mvj/property/RECEIVE_COLLAPSE_STATES', Object>;
