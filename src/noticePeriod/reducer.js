// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  NoticePeriodList,
  ReceiveNoticePeriodsAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/noticePeriod/FETCH_ALL': () => true,
  'mvj/noticePeriod/NOT_FOUND': () => false,
  'mvj/noticePeriod/RECEIVE_ALL': () => false,
}, false);


const noticePeriodsReducer: Reducer<NoticePeriodList> = handleActions({
  ['mvj/noticePeriod/RECEIVE_ALL']: (state: NoticePeriodList, {payload: noticePeriods}: ReceiveNoticePeriodsAction) => {
    return noticePeriods;
  },
}, []);

export default combineReducers({
  list: noticePeriodsReducer,
  isFetching: isFetchingReducer,
});
