// @flow

import {combineReducers} from 'redux';
import type {Action, CombinedReducer} from 'redux';
import {handleActions} from 'redux-actions';

import type {PlotApplicationsState} from '$src/plotApplications/types';
import type {Attributes, Reducer} from '$src/types';
import type {ReceiveApplicantInfoCheckAttributesAction} from '$src/application/types';

const applicantInfoCheckAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveApplicantInfoCheckAttributesAction) => attributes,
  ['mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => null,
}, null);

const isFetchingApplicantInfoCheckAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => true,
  ['mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES']: () => false,
  ['mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND']: () => false,
}, false);

export default (combineReducers<Object, Action<any>>({
  isFetchingApplicantInfoCheckAttributes: isFetchingApplicantInfoCheckAttributesReducer,
  applicantInfoCheckAttributes: applicantInfoCheckAttributesReducer,
}): CombinedReducer<PlotApplicationsState, Action<any>>);
