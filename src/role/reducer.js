// @flow

import {handleActions} from 'redux-actions';

import type {ChangeUserAction, User} from './types';

export default handleActions({
  ['mvj/user/CHANGE_USER']: (state: User, {payload: user}: ChangeUserAction) => {
    return Object.assign({}, state, user);
  },
}, {});
