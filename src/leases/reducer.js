// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Comment,
  Lease,
  LeasesList,
  Lessors,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  ReceiveLessorsAction,
  ReceiveCommentsAction,
  ReceiveCommentAttributesAction,
  // ReceiveSingleCommentAction,
  // ReceiveDeletedCommentAction,
  // ReceiveEditedCommentAction,
  ReceiveLeaseInfoFormValidAction,
  ReceiveSummaryFormValidAction,
  ReceiveLeaseAreasFormValidAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
  // 'mvj/leases/FETCH_IDENTIFIERS': () => true,
  // 'mvj/leases/RECEIVE_ATTRIBUTES': () => false,
  'mvj/leases/CREATE': () => true,
  'mvj/leases/EDIT': () => true,
  'mvj/leases/PATCH': () => true,
  'mvj/leases/FETCH_ALL': () => true,
  'mvj/leases/FETCH_SINGLE': () => true,
  'mvj/leases/NOT_FOUND': () => false,
  'mvj/leases/RECEIVE_ALL': () => false,
  'mvj/leases/RECEIVE_SINGLE': () => false,
}, false);

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, {});

const lessorsReducer: Reducer<Lessors> = handleActions({
  ['mvj/leases/RECEIVE_LESSORS']: (state: Lessors, {payload: lessors}: ReceiveLessorsAction) => {
    return lessors;
  },
}, []);

const leasesListReducer: Reducer<LeasesList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeasesList, {payload: leases}: ReceiveLeasesAction) => {
    return leases;
  },
}, []);

const commentsReducer: Reducer<Array<Comment>> = handleActions({
  ['mvj/leases/RECEIVE_COMMENTS']: (state: Array<Comment>, {payload: comments}: ReceiveCommentsAction) => {
    return comments;
  },
  // },
  // ['mvj/leases/RECEIVE_SINGLE_COMMENT']: (state: Lease, {payload: comment}: ReceiveSingleCommentAction) => {
  //   const newState = {...state};
  //   const comments = [...state.comments, comment];
  //   newState.comments = comments;
  //   return newState;
  // },
  // ['mvj/leases/RECEIVE_DELETED_COMMENT']: (state: Lease, {payload: comment}: ReceiveDeletedCommentAction) => {
  //   const newState = {...state};
  //   const comments = state.comments;
  //   const index = comments.findIndex((item) => item.id === comment.id);
  //   comments.splice(index, 1);
  //   newState.comments = comments;
  //   return newState;
  // },
  // ['mvj/leases/RECEIVE_EDITED_COMMENT']: (state: Lease, {payload: comment}: ReceiveEditedCommentAction) => {
  //   const newState = {...state};
  //   const comments = state.comments;
  //   const index = comments.findIndex((item) => item.id === comment.id);
  //   comments[index] = comment;
  //   newState.comments = comments;
  //   return newState;
  // },
  // ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
  //   return lease;
  // },
}, []);

const commentAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_COMMENT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveCommentAttributesAction) => {
    return attributes;
  },
}, {});

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

const leaseInfoValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_INFO_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseInfoFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const summaryValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_SUMMARY_VALID']: (state: boolean, {payload: valid}: ReceiveSummaryFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const leaseAreasValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_AREAS_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseAreasFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

export default combineReducers({
  attributes: attributesReducer,
  comments: commentsReducer,
  commentAttributes: commentAttributesReducer,
  current: currentLeaseReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: leasesListReducer,
  lessors: lessorsReducer,
  isLeaseAreasValid: leaseAreasValidReducer,
  isLeaseInfoValid: leaseInfoValidReducer,
  isSummaryValid: summaryValidReducer,
});
