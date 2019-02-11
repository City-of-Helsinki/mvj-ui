// @flow
import {expect} from 'chai';
import {
  fetchUsersPermissions,
  receiveUsersPermissions,
  notFound,
} from './actions';
import usersPermissionsReducer from './reducer';

import type {UsersPermissionsState} from './types';

const defaultState: UsersPermissionsState = {
  isFetching: false,
  permissions: [],
};

// $FlowFixMe
describe('Users permissions', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('usersPermissionsReducer', () => {

      // $FlowFixMe
      it('should update users permissions', () => {
        const dummyUsersPermissions = [
          {
            id: 1,
            name: 'User1',
          },
        ];

        const newState = {...defaultState, permissions: dummyUsersPermissions};

        const state = usersPermissionsReducer({}, receiveUsersPermissions(dummyUsersPermissions));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching users permissions', () => {
        const newState = {...defaultState, isFetching: true};

        const state = usersPermissionsReducer({}, fetchUsersPermissions());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state: Object = usersPermissionsReducer({}, fetchUsersPermissions());
        state = usersPermissionsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
