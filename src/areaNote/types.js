// @flow
import type {Action, Attributes, Methods} from '$src/types';

export type AreaNoteState = {
  attributes: Attributes,
  initialValues: Object,
  isEditMode: boolean,
  isFetching: boolean,
  isFetchingAttributes: boolean,
  list: AreaNoteList,
  methods: Methods,
};

export type AreaNoteId = number;
export type AreaNote= Object;
export type AreaNoteList = Array<AreaNote>;

export type FetchAttributesAction = Action<'mvj/areaNote/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/areaNote/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/areaNote/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/areaNote/ATTRIBUTES_NOT_FOUND', void>;

export type FetchAreaNoteListAction = Action<'mvj/areaNote/FETCH_ALL', ?Object>;
export type ReceiveAreaNoteListAction = Action<'mvj/areaNote/RECEIVE_ALL', AreaNoteList>;
export type CreateAreaNoteAction = Action<'mvj/areaNote/CREATE', AreaNote>;
export type DeleteAreaNoteAction = Action<'mvj/areaNote/DELETE', number>;
export type EditAreaNoteAction = Action<'mvj/areaNote/EDIT', AreaNote>;
export type ReceiveDeletedAreaNoteAction = Action<'mvj/areaNote/RECEIVE_DELETED', AreaNoteId>;
export type ReceiveEditedAreaNoteAction = Action<'mvj/areaNote/RECEIVE_EDITED', AreaNote>;

export type AreaNoteNotFoundAction = Action<'mvj/areaNote/NOT_FOUND', void>;

export type ShowEditModeAction = Action<'mvj/areaNote/SHOW_EDIT_MODE', void>;
export type HideEditModeAction = Action<'mvj/areaNote/HIDE_EDIT_MODE', void>;
export type InitializeAction = Action<'mvj/areaNote/INITIALIZE', Object>;
