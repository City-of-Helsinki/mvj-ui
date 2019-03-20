// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '$src/types';
import type {
  AuditLogListMap,
  AuditLogIsFetchingMap,
  FetchAuditLogByContactAction,
  ReceiveAuditLogByContactAction,
  NotFoundByContactAction,
  FetchAuditLogByLeaseAction,
  ReceiveAuditLogByLeaseAction,
  NotFoundByLeaseAction,
} from '$src/auditLog/types';

const isFetchingByContactReducer: Reducer<AuditLogIsFetchingMap> = handleActions({
  ['mvj/auditLog/FETCH_BY_CONTACT']: (state: AuditLogIsFetchingMap, {payload: contactId}: FetchAuditLogByContactAction) => ({
    ...state,
    [contactId]: true,
  }),
  ['mvj/auditLog/RECEIVE_BY_CONTACT']: (state: AuditLogIsFetchingMap, {payload}: ReceiveAuditLogByContactAction) => ({
    ...state,
    ...Object.keys(payload).reduce((obj, key) => ({...obj, [key]: false}), {}),
  }),
  ['mvj/auditLog/NOT_FOUND_BY_CONTACT']: (state: AuditLogIsFetchingMap, {payload: contactId}: NotFoundByContactAction) => ({
    ...state,
    [contactId]: false,
  }),
}, {});

const auditLogByContactReducer: Reducer<AuditLogListMap> = handleActions({
  ['mvj/auditLog/RECEIVE_BY_CONTACT']: (state: AuditLogListMap, {payload}: ReceiveAuditLogByContactAction) => ({
    ...state,
    ...payload,
  }),
}, {});

const isFetchingByLeaseReducer: Reducer<AuditLogIsFetchingMap> = handleActions({
  ['mvj/auditLog/FETCH_BY_LEASE']: (state: AuditLogIsFetchingMap, {payload}: FetchAuditLogByLeaseAction) => ({
    ...state,
    [payload.id]: true,
  }),
  ['mvj/auditLog/RECEIVE_BY_LEASE']: (state: AuditLogIsFetchingMap, {payload}: ReceiveAuditLogByLeaseAction) => ({
    ...state,
    ...Object.keys(payload).reduce((obj, key) => ({...obj, [key]: false}), {}),
  }),
  ['mvj/auditLog/NOT_FOUND_BY_LEASE']: (state: AuditLogIsFetchingMap, {payload: leaseId}: NotFoundByLeaseAction) => ({
    ...state,
    [leaseId]: false,
  }),
}, {});

const auditLogByLeaseReducer: Reducer<AuditLogListMap> = handleActions({
  ['mvj/auditLog/RECEIVE_BY_LEASE']: (state: AuditLogListMap, {payload}: ReceiveAuditLogByLeaseAction) => ({
    ...state,
    ...payload,
  }),
}, {});

export default combineReducers<Object, any>({
  byContact: auditLogByContactReducer,
  byLease: auditLogByLeaseReducer,
  isFetchingByContact: isFetchingByContactReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
});
