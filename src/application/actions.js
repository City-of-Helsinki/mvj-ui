// @flow
import {createAction} from 'redux-actions';

import type {
  ApplicantInfoCheckAttributesNotFoundAction,
  FetchApplicantInfoCheckAttributesAction,
  ReceiveApplicantInfoCheckAttributesAction,
  ReceiveUpdatedApplicantInfoCheckItemAction,
} from '$src/application/types';

export const fetchApplicantInfoCheckAttributes = (): FetchApplicantInfoCheckAttributesAction =>
  createAction('mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES')();
export const receiveApplicantInfoCheckAttributes = (payload: Object): ReceiveApplicantInfoCheckAttributesAction =>
  createAction('mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES')(payload);
export const applicantInfoCheckAttributesNotFound = (): ApplicantInfoCheckAttributesNotFoundAction =>
  createAction('mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND')();
export const receiveUpdatedApplicantInfoCheckItem = (payload: Object): ReceiveUpdatedApplicantInfoCheckItemAction =>
  createAction('mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM')(payload);
