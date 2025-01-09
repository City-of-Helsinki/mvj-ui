import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type {
  LeaseholdTransferList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveLeaseholdTransferListAction,
} from "@/leaseholdTransfer/types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/leaseholdTransfer/FETCH_ATTRIBUTES": () => true,
    "mvj/leaseholdTransfer/RECEIVE_METHODS": () => false,
    "mvj/leaseholdTransfer/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/leaseholdTransfer/RECEIVE_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const methodsReducer: Reducer<Methods> = handleActions(
  {
    ["mvj/leaseholdTransfer/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/leaseholdTransfer/FETCH_ALL": () => true,
    "mvj/leaseholdTransfer/DELETE_AND_UPDATE": () => true,
    "mvj/leaseholdTransfer/RECEIVE_ALL": () => false,
    "mvj/leaseholdTransfer/NOT_FOUND": () => false,
  },
  false,
);
const listReducer: Reducer<LeaseholdTransferList> = handleActions(
  {
    ["mvj/leaseholdTransfer/RECEIVE_ALL"]: (
      state: LeaseholdTransferList,
      { payload: list }: ReceiveLeaseholdTransferListAction,
    ) => {
      return list;
    },
  },
  {},
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  list: listReducer,
  methods: methodsReducer,
});
