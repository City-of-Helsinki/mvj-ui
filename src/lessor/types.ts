import type { Action } from "../types";
export type LessorState = {
  list: LessorList;
};
export type LessorList = Array<Record<string, any>>;
export type FetchLessorsAction = Action<"mvj/lessors/FETCH_ALL", Record<string, any>>;
export type ReceiveLessorsAction = Action<"mvj/lessors/RECEIVE_ALL", LessorList>;