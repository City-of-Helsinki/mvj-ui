import type { Action, Attributes, Methods } from "types";
export type AreaNoteState = {
  attributes: Attributes;
  initialValues: Record<string, any>;
  isEditMode: boolean;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  list: AreaNoteList;
  methods: Methods;
};
export type AreaNoteId = number;
export type AreaNote = Record<string, any>;
export type AreaNoteList = Array<AreaNote>;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchAreaNoteListAction = Action<
  string,
  Record<string, any> | null | undefined
>;
export type ReceiveAreaNoteListAction = Action<string, AreaNoteList>;
export type CreateAreaNoteAction = Action<string, AreaNote>;
export type DeleteAreaNoteAction = Action<string, number>;
export type EditAreaNoteAction = Action<string, AreaNote>;
export type ReceiveDeletedAreaNoteAction = Action<string, AreaNoteId>;
export type ReceiveEditedAreaNoteAction = Action<string, AreaNote>;
export type AreaNoteNotFoundAction = Action<string, void>;
export type ShowEditModeAction = Action<string, void>;
export type HideEditModeAction = Action<string, void>;
export type InitializeAction = Action<string, Record<string, any>>;
