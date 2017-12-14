// @flow
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  ReceiveApiTokenAction,
} from './types';


const apiTokenReducer: Reducer<Object> = handleActions({
  ['mvj/auth/RECEIVE_API_TOKEN']: (state: Object, {payload}: ReceiveApiTokenAction) => {
    return payload;
  },
}, {});

export default apiTokenReducer;
