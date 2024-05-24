import type { Action } from "src/types";
export type IndexState = {
  isFetching: boolean;
  list: IndexList;
};
export type IndexList = Array<Record<string, any>>;
export type FetchIndexListAction = Action<string, Record<string, any>>;
export type ReceiveIndexListAction = Action<string, IndexList>;
export type NotFoundAction = Action<string, void>;