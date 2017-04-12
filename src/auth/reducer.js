// @flow

import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {Session, User, ReceiveLoginAction, ReceiveUserAction} from './types';

export const sessionReducer: Reducer<Session> = handleActions({
  ['mvj/auth/PERFORM_LOGIN']: () => null,
  ['mvj/auth/FAIL_LOGIN']: () => null,
  ['mvj/auth/RECEIVE_LOGIN']: (state, {payload: session}: ReceiveLoginAction) => session,
}, null);

export const userReducer: Reducer<User> = handleActions({
  ['mvj/auth/PERFORM_LOGIN']: () => null,
  ['mvj/auth/FAIL_LOGIN']: () => null,
  ['mvj/auth/RECEIVE_USER']: (state, {payload: user}: ReceiveUserAction) => user,
}, null);

export default combineReducers({
  session: sessionReducer,
  user: userReducer,
});
