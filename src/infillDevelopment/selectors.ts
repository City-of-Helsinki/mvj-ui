import get from "lodash/get";
import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "/src/root/types";
import type { InfillDevelopment, InfillDevelopmentList } from "./types";
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.infillDevelopment.attributes;
export const getMethods: Selector<Methods, void> = (state: RootState): Methods => state.infillDevelopment.methods;
export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopment.isEditMode;
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopment.isFetching;
export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopment.isSaving;
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopment.isFetchingAttributes;
export const getInfillDevelopments: Selector<InfillDevelopmentList, void> = (state: RootState): InfillDevelopmentList => state.infillDevelopment.list;
export const getCurrentInfillDevelopment: Selector<InfillDevelopment, void> = (state: RootState): InfillDevelopment => state.infillDevelopment.current;
export const getFormInitialValues: Selector<InfillDevelopment, void> = (state: RootState): InfillDevelopment => state.infillDevelopment.initialValues;
export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopment.isSaveClicked;
export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean => state.infillDevelopment.isFormValidById[id];
export const getCollapseStateByKey: Selector<Record<string, any> | null | undefined, string> = (state: Record<string, any>, key: string): Record<string, any> | null | undefined => {
  return get(state.infillDevelopment.collapseStates, key);
};