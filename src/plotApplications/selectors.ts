import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import type { Selector } from "types";
import type { RootState } from "root/types";
import type { InfoCheckBatchEditErrorsItem, PlotApplication, PlotApplicationsList } from "/src/plotApplications/types";
import type { PlotSearch } from "/src/plotSearch/types";
export const getApplicationsByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList => state.plotApplications.listByBBox;
export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetching;
export const getIsFetchingByBBox: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingByBBox;
export const getIsSingleAllowed: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isSingleAllowed;
export const getPlotApplicationsList: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList => state.plotApplications.list;
export const getPlotApplicationsListByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList => state.plotApplications.listByBBox;
export const getCurrentPlotApplication: Selector<PlotApplication, void> = (state: RootState): PlotApplication => state.plotApplications.current;
export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isEditMode;
export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isSaveClicked;
export const getCollapseStateByKey: Selector<Record<string, any> | null | undefined, string> = (state: RootState, key: string): Record<string, any> | null | undefined => {
  return get(state.plotApplications.collapseStates, key);
};
export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean => state.plotApplications.isFormValidById[id];
export const getIsFormValidFlags: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotApplications.isFormValidById;
export const getErrorsByFormName: Selector<Record<string, any> | null | undefined, string> = (state: RootState, formName: string): Record<string, any> | null | undefined => {
  const form = state.form[formName];

  if (!isEmpty(form)) {
    return form.syncErrors;
  }

  return null;
};
export const getPlotSearchSubTypes: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> => state.plotApplications.subTypes;
export const getIsFetchingApplicationRelatedForm: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingForm;
export const getApplicationRelatedForm: Selector<Record<string, any> | null, void> = (state: RootState): Record<string, any> | null => state.plotApplications.form;
export const getIsFetchingApplicationRelatedPlotSearch: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingPlotSearch;
export const getApplicationRelatedPlotSearch: Selector<PlotSearch | null, void> = (state: RootState): PlotSearch | null => state.plotApplications.plotSearch;
export const getIsPerformingFileOperation: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isPerformingFileOperation || state.application.isPerformingFileOperation;
export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isSaving;
export const getCurrentEditorTargets: Selector<Array<Record<string, any>>, void> = (state: RootState): Array<Record<string, any>> => state.plotApplications.currentEditorTargets;
export const getApplicationApplicantInfoCheckData: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> | null | undefined => state.plotApplications.current?.information_checks;
export const getApplicationTargetInfoCheckData: Selector<Record<string, any>, void> = (state: RootState): Record<string, any> | null | undefined => state.plotApplications.current?.target_statuses;
export const getInfoCheckSubmissionErrors = (errors: Array<InfoCheckBatchEditErrorsItem>, id: number | null | undefined): InfoCheckBatchEditErrorsItem | null | undefined => {
  return errors.find(item => item.id === id);
};
export const getTargetInfoCheckSubmissionErrors = (state: RootState, id: number | null | undefined): any => {
  return getInfoCheckSubmissionErrors(state.plotApplications.infoCheckBatchEditErrors.target, id)?.error;
};
export const getApplicantInfoCheckSubmissionErrors = (state: RootState, checkDataIds: Array<number>): Array<{
  id: number;
  kind: Record<string, any> | null | undefined;
  error: (any | null | undefined) | (Array<Record<string, any>> | null | undefined);
}> => {
  return checkDataIds?.map(id => {
    const errors = getInfoCheckSubmissionErrors(state.plotApplications.infoCheckBatchEditErrors.applicant, id);
    return {
      id,
      kind: errors?.kind,
      error: errors?.error
    };
  }).filter(item => item.error !== undefined);
};
export const getTargetInfoChecksForCurrentPlotSearch = (state: RootState): Array<Record<string, any>> => state.plotApplications.targetInfoChecksForCurrentPlotSearch;
export const getIsFetchingTargetInfoChecksForCurrentPlotSearch = (state: RootState): boolean => state.plotApplications.isFetchingTargetInfoChecksForCurrentPlotSearch;