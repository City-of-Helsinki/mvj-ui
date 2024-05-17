import type { Action } from "../types";
export type UserState = {
  isFetching: boolean;
  list: UserList;
};
export type UserList = Array<Record<string, any>>;
export type FetchUsersAction = Action<"mvj/users/FETCH_ALL", string>;
export type ReceiveUsersAction = Action<"mvj/users/RECEIVE_ALL", UserList>;
export type UsersNotFoundAction = Action<"mvj/users/NOT_FOUND", void>;