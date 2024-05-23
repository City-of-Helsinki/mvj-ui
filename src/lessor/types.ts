import type { Action } from "../types";
export type LessorState = {
  list: LessorList;
};
export type LessorList = Array<Record<string, any>>;
export type FetchLessorsAction = Action<string, Record<string, any>>;
export type ReceiveLessorsAction = Action<string, LessorList>;