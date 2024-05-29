import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "types";
import type { FetchContractFilesByIdAction, ReceiveContractFilesByIdAction, NotFoundByIdAction } from "contractFile/types";
const isFetchingByIdReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/contractFile/FETCH_BY_ID']: (state: Record<string, any>, {
    payload: contractId
  }: FetchContractFilesByIdAction) => {
    return { ...state,
      [contractId]: true
    };
  },
  ['mvj/contractFile/RECEIVE_BY_ID']: (state: Record<string, any>, {
    payload
  }: ReceiveContractFilesByIdAction) => {
    return { ...state,
      [payload.contractId]: false
    };
  },
  ['mvj/contractFile/NOT_FOUND_BY_ID']: (state: Record<string, any>, {
    payload: contractId
  }: NotFoundByIdAction) => {
    return { ...state,
      [contractId]: false
    };
  }
}, {});
const byIdReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/contractFile/RECEIVE_BY_ID']: (state: Record<string, any>, {
    payload
  }: ReceiveContractFilesByIdAction) => {
    return { ...state,
      [payload.contractId]: payload.files
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  byId: byIdReducer,
  isFetchingById: isFetchingByIdReducer
});