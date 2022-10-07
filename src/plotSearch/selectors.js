// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Attributes, Selector, Methods} from '../types';
import type {RootState} from '$src/root/types';

import type {
  PlotSearch,
  PlotSearchList,
  PlanUnit,
} from './types';
import {formValueSelector} from "redux-form";
import {FormNames} from "../enums";
import {PlotSearchStageTypes} from "./enums";

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotSearch.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isEditMode;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.plotSearch.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.plotSearch.isFormValidById[id];

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isSaveClicked;

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.plotSearch.isFormValidById;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingAttributes;

export const getCurrentPlotSearch: Selector<PlotSearch, void> = (state: RootState): PlotSearch =>
  state.plotSearch.current;

export const getPlotSearchList: Selector<PlotSearchList, void> = (state: RootState): PlotSearchList =>
  state.plotSearch.list;

export const getErrorsByFormName: Selector<?Object, string> = (state: RootState, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getPlotSearchMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotSearch.methods;

export const getPlanUnitAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotSearch.planUnitAttributes;

export const getPlanUnit: Selector<PlotSearch, void> = (state: RootState): PlanUnit =>
  state.plotSearch.planUnit;

export const getIsFetchingPlanUnit: Selector<boolean, number> = (state: RootState, id: number): boolean =>
  state.plotSearch.pendingPlanUnitFetches.includes(id);

export const getIsFetchingAnyPlanUnits: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.pendingPlanUnitFetches.length > 0;

export const getIsFetchingPlanUnitAttributes: Selector<boolean, number> = (state: RootState, id: number): boolean =>
  state.plotSearch.pendingPlanUnitAttributeFetches.includes(id);

export const getIsFetchingAnyPlanUnitAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.pendingPlanUnitAttributeFetches.length > 0;

export const getIsFetchingSubtypes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingSubtypes;

export const getPlotSearchSubTypes: Selector<Object, void> = (state: RootState): Object =>
  state.plotSearch.subTypes;

export const getIsFetchingFormAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingFormAttributes;

export const getIsFetchingTemplateForms: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingTemplateForms;

export const getIsFetchingForm: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingForm;

export const getFormAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotSearch.formAttributes;

export const getTemplateForms: Selector<Object, void> = (state: RootState): Object =>
  state.plotSearch.templateForms;

export const getForm: Selector<Object, void> = (state: RootState): Object =>
  state.plotSearch.form;

export const getDecisionCandidates: Selector<Array<Object>, void> = (state: RootState): Array<Object> => {
  return Object.values(state.plotSearch.decisionCandidates).reduce((acc, next) => {
    // https://github.com/facebook/flow/issues/2133
    // $FlowFixMe
    return ([ ...acc, ...next ]);
  }, []);
};

export const areTargetsAllowedToHaveType: Selector<boolean, void> = (state: RootState): boolean => {
  const selected = formValueSelector(FormNames.PLOT_SEARCH_BASIC_INFORMATION)(state, 'subtype');
  const subtypes = getPlotSearchSubTypes(state);

  return subtypes?.find((subtype) => subtype.id === selected)?.target_selection === true;
}

export const isLockedForModifications: Selector<boolean, void> = (state: RootState): boolean => {
  const stage = getCurrentPlotSearchStage(state);
  return stage ? stage !== PlotSearchStageTypes.IN_PREPARATION : false;
}

export const isFetchingStages: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingStages;

export const getStages: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.plotSearch.stages;

export const getCurrentPlotSearchStage: Selector<string | null, void> = (state: RootState): string | null =>
  getCurrentPlotSearch(state)?.stage?.stage || null;
