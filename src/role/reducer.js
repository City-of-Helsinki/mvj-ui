// @flow

import {handleActions} from 'redux-actions';

import type {ChangeRoleAction, User} from './types';

export default handleActions({
  ['mvj/user/CHANGE_ROLE']: (state: User, {payload: user}: ChangeRoleAction) => {
    return Object.assign({}, state, user);
  },
}, {});
