// @flow
import type {Action} from '$src/types';

export type IndexState = {
  isFetching: boolean,
  list: IndexList,
}

export type IndexList = Array<Object>;

export type FetchIndexListAction = Action<'mvj/index/FETCH_ALL', Object>;
export type ReceiveIndexListAction = Action<'mvj/index/RECEIVE_ALL', IndexList>;
export type NotFoundAction = Action<'mvj/index/NOT_FOUND', void>;
