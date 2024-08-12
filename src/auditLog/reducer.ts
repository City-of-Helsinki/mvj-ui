import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "types";
import type { AuditLogListMap, AuditLogIsFetchingMap, FetchAuditLogByContactAction, ReceiveAuditLogByContactAction, NotFoundByContactAction, FetchAuditLogByLeaseAction, ReceiveAuditLogByLeaseAction, NotFoundByLeaseAction, FetchAuditLogByAreaSearchAction, NotFoundByAreaSearchAction, ReceiveAuditLogByAreaSearchAction } from "@/auditLog/types";
const isFetchingByContactReducer: Reducer<AuditLogIsFetchingMap> = handleActions({
  ['mvj/auditLog/FETCH_BY_CONTACT']: (state: AuditLogIsFetchingMap, {
    payload: contactId
  }: FetchAuditLogByContactAction) => ({ ...state,
    [contactId]: true
  }),
  ['mvj/auditLog/RECEIVE_BY_CONTACT']: (state: AuditLogIsFetchingMap, {
    payload
  }: ReceiveAuditLogByContactAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/auditLog/NOT_FOUND_BY_CONTACT']: (state: AuditLogIsFetchingMap, {
    payload: contactId
  }: NotFoundByContactAction) => ({ ...state,
    [contactId]: false
  })
}, {});
const auditLogByContactReducer: Reducer<AuditLogListMap> = handleActions({
  ['mvj/auditLog/RECEIVE_BY_CONTACT']: (state: AuditLogListMap, {
    payload
  }: ReceiveAuditLogByContactAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingByLeaseReducer: Reducer<AuditLogIsFetchingMap> = handleActions({
  ['mvj/auditLog/FETCH_BY_LEASE']: (state: AuditLogIsFetchingMap, {
    payload
  }: FetchAuditLogByLeaseAction) => ({ ...state,
    [payload.id]: true
  }),
  ['mvj/auditLog/RECEIVE_BY_LEASE']: (state: AuditLogIsFetchingMap, {
    payload
  }: ReceiveAuditLogByLeaseAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/auditLog/NOT_FOUND_BY_LEASE']: (state: AuditLogIsFetchingMap, {
    payload: leaseId
  }: NotFoundByLeaseAction) => ({ ...state,
    [leaseId]: false
  })
}, {});
const auditLogByLeaseReducer: Reducer<AuditLogListMap> = handleActions({
  ['mvj/auditLog/RECEIVE_BY_LEASE']: (state: AuditLogListMap, {
    payload
  }: ReceiveAuditLogByLeaseAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingByAreaSearchReducer: Reducer<AuditLogIsFetchingMap> = handleActions({
  ['mvj/auditLog/FETCH_BY_AREASEARCH']: (state: AuditLogIsFetchingMap, {
    payload
  }: FetchAuditLogByAreaSearchAction) => ({ ...state,
    [payload.id]: true
  }),
  ['mvj/auditLog/RECEIVE_BY_AREASEARCH']: (state: AuditLogIsFetchingMap, {
    payload
  }: ReceiveAuditLogByAreaSearchAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/auditLog/NOT_FOUND_BY_AREASEARCH']: (state: AuditLogIsFetchingMap, {
    payload: areaSearchId
  }: NotFoundByAreaSearchAction) => ({ ...state,
    [areaSearchId]: false
  })
}, {});
const auditLogByAreaSearchReducer: Reducer<AuditLogListMap> = handleActions({
  ['mvj/auditLog/RECEIVE_BY_AREASEARCH']: (state: AuditLogListMap, {
    payload
  }: ReceiveAuditLogByAreaSearchAction) => ({ ...state,
    ...payload
  })
}, {});
export default combineReducers<Record<string, any>, any>({
  byContact: auditLogByContactReducer,
  byLease: auditLogByLeaseReducer,
  byAreaSearch: auditLogByAreaSearchReducer,
  isFetchingByContact: isFetchingByContactReducer,
  isFetchingByLease: isFetchingByLeaseReducer,
  isFetchingByAreaSearch: isFetchingByAreaSearchReducer
});