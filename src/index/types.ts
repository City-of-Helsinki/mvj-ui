import type { Action } from "src/types";
export type IndexState = {
  isFetching: boolean;
  list: IndexList;
};
export type IndexList = Array<Record<string, any>>;
export type FetchIndexListAction = Action<"mvj/index/FETCH_ALL", Record<string, any>>;
export type ReceiveIndexListAction = Action<"mvj/index/RECEIVE_ALL", IndexList>;
export type NotFoundAction = Action<"mvj/index/NOT_FOUND", void>;