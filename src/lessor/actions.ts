import { createAction } from "redux-actions";
import type { LessorList, FetchLessorsAction, ReceiveLessorsAction } from "./types";
export const fetchLessors = (params: Record<string, any>): FetchLessorsAction => createAction('mvj/lessors/FETCH_ALL')(params);
export const receiveLessors = (lessors: LessorList): ReceiveLessorsAction => createAction('mvj/lessors/RECEIVE_ALL')(lessors);