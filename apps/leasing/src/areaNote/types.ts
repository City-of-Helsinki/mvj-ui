import type { Attributes, Methods } from "types";
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
