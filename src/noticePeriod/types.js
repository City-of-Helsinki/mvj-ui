// @flow

import type {Action} from '../types';

export type NoticePeriodState = Object;
export type NoticePeriodList = Array<Object>;

export type FetchNoticePeriodsAction = Action<'mvj/noticePeriod/FETCH_ALL', void>;
export type ReceiveNoticePeriodsAction = Action<'mvj/noticePeriod/RECEIVE_ALL', NoticePeriodList>;
export type NoticePeriodNotFoundAction = Action<'mvj/noticePeriod/NOT_FOUND', void>;
