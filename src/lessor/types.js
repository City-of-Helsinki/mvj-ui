// @flow
import type {Action} from '../types';

export type LessorState = {
  list: LessorList,
}

export type LessorList = Array<Object>;

export type FetchLessorsAction = Action<'mvj/lessors/FETCH_ALL', Object>;
export type ReceiveLessorsAction = Action<'mvj/lessors/RECEIVE_ALL', LessorList>;
