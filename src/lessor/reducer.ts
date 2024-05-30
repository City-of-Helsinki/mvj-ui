import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "types";
import type { LessorList, ReceiveLessorsAction } from "lessor/types";
const listReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/lessors/RECEIVE_ALL']: (state: LessorList, {
    payload
  }: ReceiveLessorsAction) => {
    return payload;
  }
}, []);
export default combineReducers<Record<string, any>, any>({
  list: listReducer
});