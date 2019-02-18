// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {LessorList, ReceiveLessorsAction} from '$src/lessor/types';

const listReducer: Reducer<Object> = handleActions({
  ['mvj/lessors/RECEIVE_ALL']: (state: LessorList, {payload}: ReceiveLessorsAction) => {
    return payload;
  },
}, []);

export default combineReducers<Object, any>({
  list: listReducer,
});
