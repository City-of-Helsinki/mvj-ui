// @flow

import type {FormSection} from '$src/plotSearch/types';
import type {Action, Attributes} from '$src/types';

export type ApplicationState = {
  isFetchingApplicantInfoCheckAttributes: boolean,
  applicantInfoCheckAttributes: Attributes,
};

export type SectionExtraComponentProps = {
  section: FormSection,
  answer: Object,
  identifier: string,
  topLevel: boolean,
};

export type FetchApplicantInfoCheckAttributesAction = Action<'mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES', void>;
export type ReceiveApplicantInfoCheckAttributesAction = Action<'mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES', Attributes>;
export type ApplicantInfoCheckAttributesNotFoundAction = Action<'mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND', void>;

export type ReceiveUpdatedApplicantInfoCheckItemAction = Action<'mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM', Object>;
