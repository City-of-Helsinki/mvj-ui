import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type {
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  FetchCollectionLettersByLeaseAction,
  ReceiveCollectionLettersByLeaseAction,
  CollectionLettersNotFoundByLeaseAction,
} from "./types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/collectionLetter/FETCH_ATTRIBUTES": () => true,
    "mvj/collectionLetter/RECEIVE_ATTRIBUTES": () => false,
    "mvj/collectionLetter/RECEIVE_METHODS": () => false,
    "mvj/collectionLetter/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/collectionLetter/RECEIVE_ATTRIBUTES"]: (
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
    ["mvj/collectionLetter/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const isFetchingByLeaseReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/collectionLetter/FETCH_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: lease }: FetchCollectionLettersByLeaseAction,
    ) => {
      return { ...state, [lease]: true };
    },
    ["mvj/collectionLetter/RECEIVE_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: { lease } }: ReceiveCollectionLettersByLeaseAction,
    ) => {
      return { ...state, [lease]: false };
    },
    ["mvj/collectionLetter/NOT_FOUND_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: lease }: CollectionLettersNotFoundByLeaseAction,
    ) => {
      return { ...state, [lease]: false };
    },
  },
  {},
);
const byLeaseReducer: Reducer<Record<string, any>> = handleActions(
  {
    ["mvj/collectionLetter/RECEIVE_BY_LEASE"]: (
      state: Record<string, any>,
      { payload }: ReceiveCollectionLettersByLeaseAction,
    ) => {
      return { ...state, [payload.lease]: payload.collectionLetters };
    },
  },
  {},
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
  methods: methodsReducer,
});
