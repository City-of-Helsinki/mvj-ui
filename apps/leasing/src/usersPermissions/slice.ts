import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  UserGroups,
  UsersPermissions,
  UserServiceUnit,
  UserServiceUnits,
  UsersPermissionsState,
} from "./types";

export const initialState: UsersPermissionsState = {
  activeServiceUnit: null,
  groups: [],
  isFetching: false,
  permissions: [],
  serviceUnits: [],
};

const usersPermissionsSlice = createSlice({
  name: "mvj/usersPermissions",
  initialState,
  reducers: {
    fetchUsersPermissions: (state) => {
      state.isFetching = true;
    },

    receiveUsersPermissions: (
      state,
      { payload }: PayloadAction<UsersPermissions>,
    ) => {
      state.permissions = payload;
      state.isFetching = false;
    },

    receiveUserGroups: (state, { payload }: PayloadAction<UserGroups>) => {
      state.groups = payload;
    },

    receiveUserServiceUnits: (
      state,
      { payload }: PayloadAction<UserServiceUnits>,
    ) => {
      state.serviceUnits = payload;
    },

    setUserActiveServiceUnit: (
      state,
      { payload }: PayloadAction<UserServiceUnit>,
    ) => {
      state.activeServiceUnit = payload;
    },

    notFound: (state) => {
      state.isFetching = false;
    },
  },
});

export const {
  fetchUsersPermissions,
  receiveUsersPermissions,
  receiveUserGroups,
  receiveUserServiceUnits,
  setUserActiveServiceUnit,
  notFound,
} = usersPermissionsSlice.actions;

export default usersPermissionsSlice.reducer;
