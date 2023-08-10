// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {InfoCheckBatchEditErrorsItem, PlotApplication, PlotApplicationsList} from '$src/plotApplications/types';
import type {PlotSearch} from '$src/plotSearch/types';

export const getApplicationsByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.listByBBox;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetching;

export const getIsFetchingByBBox: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingByBBox;

export const getPlotApplicationsList: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.list;

export const getPlotApplicationsListByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.listByBBox;

export const getCurrentPlotApplication: Selector<PlotApplication, void> = (state: RootState): PlotApplication =>
  state.plotApplications.current;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isEditMode;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isSaveClicked;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.plotApplications.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.plotApplications.isFormValidById[id];

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.plotApplications.isFormValidById;

export const getErrorsByFormName: Selector<?Object, string> = (state: RootState, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getPlotSearchSubTypes: Selector<Object, void> = (state: RootState): Object =>
  state.plotApplications.subTypes;

export const getIsFetchingApplicationRelatedForm: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingForm;

export const getApplicationRelatedForm: Selector<Object | null, void> = (state: RootState): Object | null => state.plotApplications.form;

export const getIsFetchingApplicationRelatedPlotSearch: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingPlotSearch;

export const getApplicationRelatedPlotSearch: Selector<PlotSearch | null, void> = (state: RootState): PlotSearch | null => state.plotApplications.plotSearch;

export const getIsPerformingFileOperation: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isPerformingFileOperation || state.application.isPerformingFileOperation;

export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isSaving;

export const getCurrentEditorTargets: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.plotApplications.currentEditorTargets;

export const getApplicationApplicantInfoCheckData: Selector<Object, void> = (state: RootState): ?Object =>
  state.plotApplications.current?.information_checks;

export const getApplicationTargetInfoCheckData: Selector<Object, void> = (state: RootState): ?Object =>
  state.plotApplications.current?.target_statuses;

export const getInfoCheckSubmissionErrors = (errors: Array<InfoCheckBatchEditErrorsItem>, id: ?number): ?InfoCheckBatchEditErrorsItem => {
  return errors.find((item) => item.id === id);
};
export const getTargetInfoCheckSubmissionErrors = (state: RootState, id: ?number): ?Object => {
  return getInfoCheckSubmissionErrors(state.plotApplications.infoCheckBatchEditErrors.target, id)?.error;
};
export const getApplicantInfoCheckSubmissionErrors = (state: RootState, checkDataIds: Array<number>): Array<{
  id: number,
  kind: ?Object,
  error: ?Object | ?Array<Object>,
}> => {
  return checkDataIds
    ?.map((id) => {
      const errors = getInfoCheckSubmissionErrors(state.plotApplications.infoCheckBatchEditErrors.applicant, id);
      return ({
        id,
        kind: errors?.kind,
        error: errors?.error,
      });
    })
    .filter((item) => item.error !== undefined);
};

export const getTargetInfoChecksForCurrentPlotSearch = (state: RootState): Array<Object> =>
  state.plotApplications.targetInfoChecksForCurrentPlotSearch;

export const getIsFetchingTargetInfoChecksForCurrentPlotSearch = (state: RootState): boolean =>
  state.plotApplications.isFetchingTargetInfoChecksForCurrentPlotSearch;

