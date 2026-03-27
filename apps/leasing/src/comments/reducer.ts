import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Attributes, Methods, Reducer } from "types";
import type {
  CommentListMap,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  ReceiveCommentsByLeaseAction,
  HideEditModeByIdAction,
  ShowEditModeByIdAction,
  ReceiveIsSaveClickedAction,
} from "./types";
const isFetchingReducer: Reducer<boolean> = handleActions(
  {
    "mvj/comments/CREATE": () => true,
    "mvj/comments/EDIT": () => true,
    "mvj/comments/FETCH_BY_LEASE": () => true,
    "mvj/comments/NOT_FOUND": () => false,
    "mvj/comments/RECEIVE_BY_LEASE": () => false,
  },
  false,
);
const isEditModeByIdReducer: Reducer<CommentListMap> = handleActions(
  {
    ["mvj/comments/HIDE_BY_ID"]: (
      state: Record<string, any>,
      { payload: id }: HideEditModeByIdAction,
    ) => {
      return { ...state, [id]: false };
    },
    ["mvj/comments/SHOW_BY_ID"]: (
      state: Record<string, any>,
      { payload: id }: ShowEditModeByIdAction,
    ) => {
      return { ...state, [id]: true };
    },
    "mvj/comments/CLEAR_EDIT_FLAGS": () => ({}),
  },
  {},
);
const attributesReducer: Reducer<Attributes> = handleActions(
  {
    ["mvj/comments/RECEIVE_ATTRIBUTES"]: (
      state: Attributes,
      { payload: attributes }: ReceiveAttributesAction,
    ) => {
      return attributes;
    },
  },
  null,
);
const isFetchingAttributesReducer: Reducer<boolean> = handleActions(
  {
    "mvj/comments/FETCH_ATTRIBUTES": () => true,
    "mvj/comments/RECEIVE_ATTRIBUTES": () => false,
    "mvj/comments/ATTRIBUTES_NOT_FOUND": () => false,
  },
  false,
);
const methodsReducer: Reducer<Methods> = handleActions(
  {
    ["mvj/comments/RECEIVE_METHODS"]: (
      state: Methods,
      { payload: methods }: ReceiveMethodsAction,
    ) => {
      return methods;
    },
  },
  null,
);
const byLeaseReducer: Reducer<CommentListMap> = handleActions(
  {
    ["mvj/comments/RECEIVE_BY_LEASE"]: (
      state: Record<string, any>,
      { payload: list }: ReceiveCommentsByLeaseAction,
    ) => {
      return { ...state, [list.leaseId]: list.comments };
    },
  },
  {},
);
const isSaveClickedReducer: Reducer<boolean> = handleActions(
  {
    ["mvj/comments/RECEIVE_SAVE_CLICKED"]: (
      state: boolean,
      { payload: isClicked }: ReceiveIsSaveClickedAction,
    ) => {
      return isClicked;
    },
  },
  false,
);
export default combineReducers<Record<string, any>, any>({
  attributes: attributesReducer,
  byLease: byLeaseReducer,
  isEditModeById: isEditModeByIdReducer,
  isFetching: isFetchingReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
  isSaveClicked: isSaveClickedReducer,
  methods: methodsReducer,
});
