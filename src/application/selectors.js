// @flow
import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.isFetchingApplicantInfoCheckAttributes;
export const getApplicantInfoCheckAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.application.applicantInfoCheckAttributes;
