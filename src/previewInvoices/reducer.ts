import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "@/types";
import type {
  PreviewInvoices,
  ReceivePreviewInvoicesAction,
} from "@/previewInvoices/types";
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/previewInvoices/FETCH_ALL": () => true,
    "mvj/previewInvoices/NOT_FOUND": () => false,
    "mvj/previewInvoices/RECEIVE_ALL": () => false,
  },
  false,
);
const previewInvoicesListReducer: Reducer<PreviewInvoices> = handleActions(
  {
    ["mvj/previewInvoices/RECEIVE_ALL"]: (
      state: PreviewInvoices,
      { payload: previewInvoices }: ReceivePreviewInvoicesAction,
    ) => {
      return previewInvoices;
    },
    ["mvj/previewInvoices/CLEAR"]: () => null,
  },
  null,
);
export default combineReducers<Record<string, any>, any>({
  isFetching: isFetchingReducer,
  list: previewInvoicesListReducer,
});
