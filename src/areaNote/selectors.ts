import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { AreaNoteList } from "./types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.areaNote.isFetching;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.areaNote.isFetchingAttributes;
export const getIsEditMode: Selector<boolean, void> = (
  state: RootState,
): boolean => state.areaNote.isEditMode;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.areaNote.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.areaNote.methods;
export const getInitialAreaNote: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.areaNote.initialValues;
export const getAreaNoteList: Selector<AreaNoteList, void> = (
  state: RootState,
): AreaNoteList => state.areaNote.list;
