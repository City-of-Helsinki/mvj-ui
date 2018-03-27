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
  Decisions,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveSingleLeaseAction,
  ReceiveLessorsAction,
  ReceiveDecisionsAction,
  ReceiveCommentsAction,
  ReceiveCommentAttributesAction,
  ReceiveCreatedCommentAction,
  ReceiveEditedCommentAction,
  ReceiveContractsFormValidAction,
  ReceiveDecisionsFormValidAction,
  ReceiveLeaseInfoFormValidAction,
  ReceiveSummaryFormValidAction,
  ReceiveLeaseAreasFormValidAction,
} from './types';

const isEditModeReducer: Reducer<boolean> = handleActions({
  'mvj/leases/HIDE_EDIT': () => false,
  'mvj/leases/SHOW_EDIT': () => true,
}, false);

const isFetchingReducer: Reducer<boolean> = handleActions({
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

const leasesListReducer: Reducer<LeasesList> = handleActions({
  ['mvj/leases/RECEIVE_ALL']: (state: LeasesList, {payload: leases}: ReceiveLeasesAction) => {
    return leases;
  },
}, []);

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

const commentsReducer: Reducer<Array<Comment>> = handleActions({
  ['mvj/leases/RECEIVE_COMMENTS']: (state: Array<Comment>, {payload: comments}: ReceiveCommentsAction) => {
    return comments;
  },
  ['mvj/leases/RECEIVE_CREATED_COMMENT']: (state: Array<Comment>, {payload: comment}: ReceiveCreatedCommentAction) => {
    const comments = [comment, ...state];
    return comments;
  },
  ['mvj/leases/RECEIVE_EDITED_COMMENT']: (state: Array<Comment>, {payload: comment}: ReceiveEditedCommentAction) => {
    const comments = [...state];
    const index = comments.findIndex((item) => item.id === comment.id);
    comments[index] = comment;
    return comments;
  },
}, []);

const commentAttributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/leases/RECEIVE_COMMENT_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveCommentAttributesAction) => {
    return attributes;
  },
}, {});

const lessorsReducer: Reducer<Lessors> = handleActions({
  ['mvj/leases/RECEIVE_LESSORS']: (state: Lessors, {payload: lessors}: ReceiveLessorsAction) => {
    return lessors;
  },
}, []);

const decisionsReducer: Reducer<Decisions> = handleActions({
  ['mvj/leases/RECEIVE_DECISIONS']: (state: Decisions, {payload: decisions}: ReceiveDecisionsAction) => {
    return decisions;
  },
}, []);

const contractsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_CONTRACTS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveContractsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const decisionsFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_DECISIONS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveDecisionsFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const leaseInfoFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_INFO_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseInfoFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const summaryFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_SUMMARY_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveSummaryFormValidAction) => {
    return valid;
  },
  'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS': () => true,
}, true);

const leaseAreasFormValidReducer: Reducer<boolean> = handleActions({
  ['mvj/leases/RECEIVE_LEASE_AREAS_FORM_VALID']: (state: boolean, {payload: valid}: ReceiveLeaseAreasFormValidAction) => {
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
  isContractsFormValid: contractsFormValidReducer,
  isDecisionsFormValid: decisionsFormValidReducer,
  isLeaseAreasFormValid: leaseAreasFormValidReducer,
  isLeaseInfoFormValid: leaseInfoFormValidReducer,
  isSummaryFormValid: summaryFormValidReducer,
  list: leasesListReducer,
  lessors: lessorsReducer,
  decisions: decisionsReducer,
});
