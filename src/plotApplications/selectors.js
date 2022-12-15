// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Attributes, Selector, Methods} from '$src/types';
import type {RootState} from '$src/root/types';

import type {
  PlotApplicationsList,
  PlotApplication,
} from '$src/plotApplications/types';
import type {PlotSearch} from '$src/plotSearch/types';

export const getApplicationsByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.listByBBox;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.attributes;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetching;

export const getIsFetchingByBBox: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingByBBox;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingAttributes;

export const getPlotApplicationsList: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.list;

export const getPlotApplicationsListByBBox: Selector<PlotApplicationsList, void> = (state: RootState): PlotApplicationsList =>
  state.plotApplications.listByBBox;

export const getPlotApplicationsMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotApplications.methods;

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

export const getIsFetchingApplicationRelatedAttachments: Selector<boolean, void> = (state: RootState): boolean => state.plotApplications.isFetchingAttachments;

export const getApplicationRelatedAttachments: Selector<Array<Object>, void> = (state: RootState): Array<Object> => state.plotApplications.attachments || [];

export const getFieldTypeMapping: Selector<Object, void> = (state: RootState): Object =>
  state.plotApplications.fieldTypeMapping;

export const getPendingUploads: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.plotApplications.pendingUploads;

export const getIsFetchingPendingUploads: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingPendingUploads;

export const getIsPerformingFileOperation: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isPerformingFileOperation;

export const getIsFetchingAttachmentAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isFetchingAttachmentAttributes;

export const getAttachmentAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.attachmentAttributes;

export const getAttachmentMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotApplications.attachmentMethods;

export const getIsSaving: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotApplications.isSaving;

export const getCurrentEditorTargets: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.plotApplications.currentEditorTargets;

export const getIsFetchingApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.isFetchingApplicantInfoCheckAttributes;

export const getApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotApplications.applicantInfoCheckAttributes;

export const getApplicationApplicantInfoCheckData: Selector<Object, void> = (state: RootState): ?Object =>
  state.plotApplications.current?.information_checks;

export const getApplicationTargetInfoCheckData: Selector<Object, void> = (state: RootState): ?Object =>
  state.plotApplications.current?.target_statuses;

export const getIsUpdatingApplicantInfoCheckData: Selector<{ [id: number]: boolean }, void> = (state: RootState): { [id: number]: boolean } =>
  state.plotApplications.isUpdatingApplicantInfoCheck;

export const getWasLastApplicantInfoCheckUpdateSuccessfulData: Selector<{ [id: number]: boolean }, void> = (state: RootState): { [id: number]: boolean } =>
  state.plotApplications.lastApplicantInfoCheckUpdateSuccessful;

export const getExistingUploads = (state: RootState, identifier: string): Array<Object> => {
  return getApplicationRelatedAttachments(state).filter((attachment) => attachment.field === identifier);
};
