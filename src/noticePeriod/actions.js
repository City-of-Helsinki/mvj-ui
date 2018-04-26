// @flow

import {createAction} from 'redux-actions';

import type {
  NoticePeriodList,
  FetchNoticePeriodsAction,
  ReceiveNoticePeriodsAction,
  NoticePeriodNotFoundAction,
} from './types';

export const notFound = (): NoticePeriodNotFoundAction =>
  createAction('mvj/noticePeriod/NOT_FOUND')();

export const fetchNoticePeriods = (): FetchNoticePeriodsAction =>
  createAction('mvj/noticePeriod/FETCH_ALL')();

export const receiveNoticePeriods = (noticePeriods: NoticePeriodList): ReceiveNoticePeriodsAction  =>
  createAction('mvj/noticePeriod/RECEIVE_ALL')(noticePeriods);
