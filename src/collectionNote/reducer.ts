import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type { ReceiveAttributesAction, ReceiveMethodsAction, FetchCollectionNotesByLeaseAction, ReceiveCollectionNotesByLeaseAction, CollectionNotesNotFoundByLeaseAction } from "./types";
const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  'mvj/collectionNote/FETCH_ATTRIBUTES': () => true,
  'mvj/collectionNote/RECEIVE_ATTRIBUTES': () => false,
  'mvj/collectionNote/RECEIVE_METHODS': () => false,
  'mvj/collectionNote/ATTRIBUTES_NOT_FOUND': () => false
}, false);
const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/collectionNote/RECEIVE_ATTRIBUTES']: (state: Attributes, {
    payload: attributes
  }: ReceiveAttributesAction) => {
    return attributes;
  }
}, null);
const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/collectionNote/RECEIVE_METHODS']: (state: Methods, {
    payload: methods
  }: ReceiveMethodsAction) => {
    return methods;
  }
}, null);
const isFetchingByLeaseReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/collectionNote/FETCH_BY_LEASE']: (state: Record<string, any>, {
    payload: lease
  }: FetchCollectionNotesByLeaseAction) => {
    return { ...state,
      [lease]: true
    };
  },
  ['mvj/collectionNote/RECEIVE_BY_LEASE']: (state: Record<string, any>, {
    payload: {
      lease
    }
  }: ReceiveCollectionNotesByLeaseAction) => {
    return { ...state,
      [lease]: false
    };
  },
  ['mvj/collectionNote/NOT_FOUND_BY_LEASE']: (state: Record<string, any>, {
    payload: lease
  }: CollectionNotesNotFoundByLeaseAction) => {
    return { ...state,
      [lease]: false
    };
  }
}, {});
const byLeaseReducer: Reducer<Record<string, any>> = handleActions({
  ['mvj/collectionNote/RECEIVE_BY_LEASE']: (state: Record<string, any>, {
    payload
  }: ReceiveCollectionNotesByLeaseAction) => {
    return { ...state,
      [payload.lease]: payload.collectionNotes
    };
  }
}, {});
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
  methods: methodsReducer
});