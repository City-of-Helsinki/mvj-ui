import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "@/types";
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  FetchCollectionCourtDecisionsByLeaseAction,
  ReceiveCollectionCourtDecisionsByLeaseAction,
  CollectionCourtDecisionsNotFoundByLeaseAction,
} from "./types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/collectionCourtDecision/FETCH_ATTRIBUTES": () => true,
    "mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES": () => false,
    "mvj/collectionCourtDecision/RECEIVE_METHODS": () => false,
    "mvj/collectionCourtDecision/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/collectionCourtDecision/RECEIVE_ATTRIBUTES"]: (
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
    ["mvj/collectionCourtDecision/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const isPanelOpenReducer: Reducer<boolean> = handleActions(
  {
    "mvj/collectionCourtDecision/HIDE_PANEL": () => false,
    "mvj/collectionCourtDecision/SHOW_PANEL": () => true,
  },
  false,
);
const isFetchingByLeaseReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/collectionCourtDecision/FETCH_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: lease }: FetchCollectionCourtDecisionsByLeaseAction,
    ) => {
      return { ...state, [lease]: true };
    },
    ["mvj/collectionCourtDecision/RECEIVE_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: { lease } }: ReceiveCollectionCourtDecisionsByLeaseAction,
    ) => {
      return { ...state, [lease]: false };
    },
    ["mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: lease }: CollectionCourtDecisionsNotFoundByLeaseAction,
    ) => {
      return { ...state, [lease]: false };
    },
  },
  {},
);
const byLeaseReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/collectionCourtDecision/RECEIVE_BY_LEASE"]: (
      state: Record<string, any>,
      { payload }: ReceiveCollectionCourtDecisionsByLeaseAction,
    ) => {
      return { ...state, [payload.lease]: payload.collectionCourtDecisions };
    },
  },
  {},
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
  isPanelOpen: isPanelOpenReducer,
  methods: methodsReducer,
});
