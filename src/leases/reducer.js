// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  Attributes,
  Lease,
  LeasesList,
  Lessors,
  ReceiveAttributesAction,
  ReceiveLeasesAction,
  ReceiveLessorsAction,
  ReceiveSingleLeaseAction,
  ReceiveCommentAction,
  ReceiveDeletedCommentAction,
  ReceiveEditedCommentAction,
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

const currentLeaseReducer: Reducer<Lease> = handleActions({
  ['mvj/leases/RECEIVE_COMMENT']: (state: Lease, {payload: comment}: ReceiveCommentAction) => {
    const newState = {...state};
    const comments = [...state.comments, comment];
    newState.comments = comments;
    return newState;
  },
  ['mvj/leases/RECEIVE_DELETED_COMMENT']: (state: Lease, {payload: comment}: ReceiveDeletedCommentAction) => {
    const newState = {...state};
    const comments = state.comments;
    const index = comments.findIndex((item) => item.id === comment.id);
    comments.splice(index, 1);
    newState.comments = comments;
    return newState;
  },
  ['mvj/leases/RECEIVE_EDITED_COMMENT']: (state: Lease, {payload: comment}: ReceiveEditedCommentAction) => {
    const newState = {...state};
    const comments = state.comments;
    const index = comments.findIndex((item) => item.id === comment.id);
    comments[index] = comment;
    newState.comments = comments;
    return newState;
  },
  ['mvj/leases/RECEIVE_SINGLE']: (state: Lease, {payload: lease}: ReceiveSingleLeaseAction) => {
    return lease;
  },
}, {});

export default combineReducers({
  attributes: attributesReducer,
  current: currentLeaseReducer,
  isEditMode: isEditModeReducer,
  isFetching: isFetchingReducer,
  list: leasesListReducer,
  lessors: lessorsReducer,
});
