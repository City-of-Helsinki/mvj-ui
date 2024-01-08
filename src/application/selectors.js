// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.application.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isFetchingAttributes;

export const getIsFetchingApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.isFetchingApplicantInfoCheckAttributes;

export const getApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.applicantInfoCheckAttributes;

export const getIsFetchingFormAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isFetchingFormAttributes;

export const getFormAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.formAttributes;

export const getFieldTypeMapping: Selector<Object, void> = (state: RootState): Object =>
  state.application.fieldTypeMapping;

export const getIsFetchingAttachmentAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isFetchingAttachmentAttributes;

export const getAttachmentAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.attachmentAttributes;

export const getAttachmentMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.application.attachmentMethods;

export const getIsFetchingApplicationRelatedAttachments: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isFetchingApplicationAttachments;

export const getApplicationRelatedAttachments: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.application.applicationAttachments || [];

export const getPendingUploads: Selector<Array<Object>, void> = (state: RootState): Array<Object> =>
  state.application.pendingUploads;

export const getIsFetchingPendingUploads: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isFetchingPendingUploads;

export const getExistingUploads = (state: RootState, identifier: string): Array<Object> => {
  return getApplicationRelatedAttachments(state).filter((attachment) => attachment.field === identifier);
};
export const getIsPerformingFileOperation: Selector<boolean, void> = (state: RootState): boolean =>
  state.application.isPerformingFileOperation;
