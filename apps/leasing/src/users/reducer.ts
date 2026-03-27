import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type { UserList, ReceiveUsersAction } from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/users/FETCH_ALL": () => true,
    "mvj/users/NOT_FOUND": () => false,
    "mvj/users/RECEIVE_ALL": () => false,
  },
  false,
);
const usersListReducer: Reducer<UserList> = handleActions(
  {
    ["mvj/users/RECEIVE_ALL"]: (
      state: UserList,
      { payload: users }: ReceiveUsersAction,
    ) => {
      return users;
    },
  },
  [],
);
export default combineReducers<Record<string, any>, any>({
  isFetching: isFetchingReducer,
  list: usersListReducer,
});
