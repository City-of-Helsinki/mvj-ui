import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import type { Attributes, Methods, Selector } from "src/types";
import type { RootState } from "src/root/types";
import type { CustomDetailedPlan, PlanUnit, PlotSearch, PlotSearchList } from "src/plotSearch/types";
import { formValueSelector } from "redux-form";
import { FormNames } from "src/enums";
import { PlotSearchStageTypes } from "src/plotSearch/enums";
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.plotSearch.attributes;
export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isEditMode;
export const getCollapseStateByKey: Selector<Record<string, any> | null | undefined, string> = (state: RootState, key: string): Record<string, any> | null | undefined => {
  return get(state.plotSearch.collapseStates, key);
};
export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean => state.plotSearch.isFormValidById[id];
export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isSaveClicked;
export const getIsFormValidFlags: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotSearch.isFormValidById;
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetching;
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingAttributes;
export const getCurrentPlotSearch: Selector<PlotSearch, void> = (state: RootState): PlotSearch => state.plotSearch.current;
export const getPlotSearchList: Selector<PlotSearchList, void> = (state: RootState): PlotSearchList => state.plotSearch.list;
export const getErrorsByFormName: Selector<Record<string, any> | null | undefined, string> = (state: RootState, formName: string): Record<string, any> | null | undefined => {
  const form = state.form[formName];

  if (!isEmpty(form)) {
    return form.syncErrors;
  }

  return null;
};
export const getPlotSearchMethods: Selector<Methods, void> = (state: RootState): Methods => state.plotSearch.methods;
export const getPlanUnitAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.plotSearch.planUnitAttributes;
export const getPlanUnit: Selector<PlotSearch, void> = (state: RootState): PlanUnit => state.plotSearch.planUnit;
export const getCustomDetailedPlan: Selector<CustomDetailedPlan, void> = (state: RootState): CustomDetailedPlan => state.plotSearch.customDetailedPlan;
export const getCustomDetailedPlanAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.plotSearch.customDetailedPlanAttributes;
export const getIsFetchingCustomDetailedPlanAttributes: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingCustomDetailedPlanAttributes;
export const getIsFetchingCustomDetailedPlan: Selector<boolean, number> = (state: RootState, id: number): boolean => state.plotSearch.pendingCustomDetailedPlanFetches.includes(id);
export const getIsFetchingPlanUnit: Selector<boolean, number> = (state: RootState, id: number): boolean => state.plotSearch.pendingPlanUnitFetches.includes(id);
export const getIsFetchingAnyPlanUnits: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.pendingPlanUnitFetches.length > 0;
export const getIsFetchingPlanUnitAttributes: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingPlanUnitAttributes;
export const getIsFetchingSubtypes: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingSubtypes;
export const getPlotSearchSubTypes: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotSearch.subTypes;
export const getIsFetchingTemplateForms: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingTemplateForms;
export const getIsFetchingForm: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingForm;
export const getTemplateForms: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotSearch.templateForms;
export const getForm: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotSearch.form;
export const getDecisionCandidates: Selector<Array<Record<string, any>>, void> = (state: RootState): Array<Record<string, any>> => {
  return Object.values(state.plotSearch.decisionCandidates).reduce((acc, next) => {
    // https://github.com/facebook/flow/issues/2133
    // $FlowFixMe
    return [...acc, ...next];
  }, []);
};
export const areTargetsAllowedToHaveType: Selector<boolean, void> = (state: RootState): boolean => {
  const selected = formValueSelector(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(state, 'subtype');
  const subtypes = getPlotSearchSubTypes(state);
  return subtypes?.find(subtype => subtype.id === selected)?.target_selection === true;
};
export const isLockedForModifications: Selector<boolean, void> = (state: RootState): boolean => {
  const stage = getCurrentPlotSearchStage(state);
  return stage ? stage !== PlotSearchStageTypes.IN_PREPARATION : false;
};
export const isFetchingStages: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingStages;
export const getStages: Selector<Array<Record<string, any>>, void> = (state: RootState): Array<Record<string, any>> => state.plotSearch.stages;
export const getCurrentPlotSearchStage: Selector<string | null, void> = (state: RootState): string | null => getCurrentPlotSearch(state)?.stage?.stage || null;
export const getIsBatchCreatingReservationIdentifiers: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isBatchCreatingReservationIdentifiers;
export const getLastBatchReservationCreationError: Selector<any, void> = (state: RootState): any => state.plotSearch.lastBatchReservationCreationError;
export const getIsFetchingReservationIdentifierUnitLists: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingReservationIdentifierUnitLists;
export const getReservationIdentifierUnitLists: Selector<Record<string, any>, void> = (state: RootState): null | Record<string, any> => state.plotSearch.reservationIdentifierUnitLists;
export const getIsCreatingDirectReservationLink: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isCreatingDirectReservationLink;
export const getSectionEditorCollapseStates: Selector<Record<string, boolean>, void> = (state: RootState): Record<string, boolean> => state.plotSearch.sectionEditorCollapseStates;
export const getRelatedApplications: Selector<Array<Record<string, any>>, void> = (state: RootState): Array<Record<string, any>> => state.plotSearch.relatedApplications;
export const getIsFetchingRelatedApplications: Selector<boolean, void> = (state: RootState): boolean => state.plotSearch.isFetchingRelatedApplications;