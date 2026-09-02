import { describe, expect, it } from "vitest";
import usersPermissionsReducer, {
  fetchUsersPermissions,
  receiveUserGroups,
  receiveUsersPermissions,
  notFound,
  initialState,
} from "./slice";

describe("Users permissions", () => {
  describe("Reducer", () => {
    describe("usersPermissionsReducer", () => {
      it("should update user groups", () => {
        const dummyUserGroups = ["UserGroup1"];
        const newState = { ...initialState, groups: dummyUserGroups };
        const state = usersPermissionsReducer(
          initialState,
          receiveUserGroups(dummyUserGroups),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update users permissions", () => {
        const dummyUsersPermissions = [
          {
            id: 1,
            name: "User1",
          },
        ];
        const newState = {
          ...initialState,
          permissions: dummyUsersPermissions,
        };
        const state = usersPermissionsReducer(
          initialState,
          receiveUsersPermissions(dummyUsersPermissions),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to true when fetching users permissions", () => {
        const newState = { ...initialState, isFetching: true };
        const state = usersPermissionsReducer(
          initialState,
          fetchUsersPermissions(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetching flag to false by notFound", () => {
        const newState = { ...initialState, isFetching: false };
        let state = usersPermissionsReducer(
          initialState,
          fetchUsersPermissions(),
        );
        state = usersPermissionsReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
