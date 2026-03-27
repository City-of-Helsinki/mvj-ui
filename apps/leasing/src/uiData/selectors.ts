import type { Attributes, Methods, Selector } from "@/types";
import type { RootState } from "@/root/types";
import type { UiDataList } from "./types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.uiData.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.uiData.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.uiData.methods;
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.uiData.isFetching;
export const getUiDataList: Selector<UiDataList, void> = (
  state: RootState,
): UiDataList => {
  return state.uiData.list;
};
