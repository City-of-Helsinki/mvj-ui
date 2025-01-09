import type { Action } from "@/types";
export type UserState = {
  isFetching: boolean;
  list: UserList;
};
export type UserList = Array<Record<string, any>>;
export type FetchUsersAction = Action<string, string>;
export type ReceiveUsersAction = Action<string, UserList>;
export type UsersNotFoundAction = Action<string, void>;
