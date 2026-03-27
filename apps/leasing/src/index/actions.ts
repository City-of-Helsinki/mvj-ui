import { createAction } from "redux-actions";
import type {
  IndexList,
  FetchIndexListAction,
  ReceiveIndexListAction,
  NotFoundAction,
} from "@/index/types";
export const fetchIndexList = (
  query: Record<string, any>,
): FetchIndexListAction => createAction("mvj/index/FETCH_ALL")(query);
export const receiveIndexList = (
  indexList: IndexList,
): ReceiveIndexListAction => createAction("mvj/index/RECEIVE_ALL")(indexList);
export const notFound = (): NotFoundAction =>
  createAction("mvj/index/NOT_FOUND")();
