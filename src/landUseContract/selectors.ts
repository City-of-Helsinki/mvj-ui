import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import type { Attributes, Selector, Methods } from "../types";
import type { RootState } from "src/root/types";
import type { LandUseContract, LandUseContractList } from "./types";
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.landUseContract.attributes;
export const getMethods: Selector<Attributes, void> = (state: RootState): Methods => state.landUseContract.methods;
export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean => state.landUseContract.isEditMode;
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.landUseContract.isFetching;
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.landUseContract.isFetchingAttributes;
export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean => state.landUseContract.isSaveClicked;
export const getLandUseContractList: Selector<LandUseContractList, void> = (state: RootState): LandUseContractList => state.landUseContract.list;
export const getCurrentLandUseContract: Selector<LandUseContract, void> = (state: RootState): LandUseContract => state.landUseContract.current;
export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean => state.landUseContract.isFormValidById[id];
export const getIsFormValidFlags: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.landUseContract.isFormValidById;
export const getErrorsByFormName: Selector<Record<string, any> | null | undefined, string> = (state: RootState, formName: string): Record<string, any> | null | undefined => {
  const form = state.form[formName];

  if (!isEmpty(form)) {
    return form.syncErrors;
  }

  return null;
};
export const getCollapseStateByKey: Selector<Record<string, any> | null | undefined, string> = (state: Record<string, any>, key: string): Record<string, any> | null | undefined => {
  return get(state.landUseContract.collapseStates, key);
};