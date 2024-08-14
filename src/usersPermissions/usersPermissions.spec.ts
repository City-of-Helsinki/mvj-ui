import { describe, expect, it } from "vitest";
import { fetchUsersPermissions, receiveUserGroups, receiveUsersPermissions, notFound } from "./actions";
import usersPermissionsReducer from "./reducer";
import type { UsersPermissionsState } from "./types";
const defaultState: UsersPermissionsState = {
  activeServiceUnit: null,
  groups: [],
  isFetching: false,
  permissions: [],
  serviceUnits: []
};

describe('Users permissions', () => {
  describe('Reducer', () => {
    describe('usersPermissionsReducer', () => {
      it('should update user groups', () => {
        const dummyUserGroups = ['UserGroup1'];
        const newState = { ...defaultState,
          groups: dummyUserGroups
        };
        const state = usersPermissionsReducer({}, receiveUserGroups(dummyUserGroups));
        expect(state).to.deep.equal(newState);
      });
      it('should update users permissions', () => {
        const dummyUsersPermissions = [{
          id: 1,
          name: 'User1'
        }];
        const newState = { ...defaultState,
          permissions: dummyUsersPermissions
        };
        const state = usersPermissionsReducer({}, receiveUsersPermissions(dummyUsersPermissions));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to true when fetching users permissions', () => {
        const newState = { ...defaultState,
          isFetching: true
        };
        const state = usersPermissionsReducer({}, fetchUsersPermissions());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetching flag to false by notFound', () => {
        const newState = { ...defaultState,
          isFetching: false
        };
        let state: Record<string, any> = usersPermissionsReducer({}, fetchUsersPermissions());
        state = usersPermissionsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});