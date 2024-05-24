import { combineReducers } from "redux";
import { handleActions } from "redux-actions";
import type { Reducer } from "src/types";
import type { CreditDecisionDataMap, CreditDecisionNotFoundByBusinessIdAction, CreditDecisionNotFoundByContactIdAction, CreditDecisionNotFoundByNinAction, FetchCreditDecisionByBusinessIdAction, FetchCreditDecisionByContactIdAction, FetchCreditDecisionByNinAction, FetchHistoryByBusinessIdAction, FetchHistoryByContactIdAction, HistoryDataMap, HistoryNotFoundByBusinessIdAction, HistoryNotFoundByContactIdAction, IsFetchingCreditDecisionMap, IsFetchingHistoryMap, ReceiveCreditDecisionByBusinessIdAction, ReceiveCreditDecisionByContactIdAction, ReceiveCreditDecisionByNinAction, ReceiveHistoryByBusinessIdAction, ReceiveHistoryByContactIdAction } from "src/creditDecision/types";
const isFetchingHistoryByBusinessIdReducer: Reducer<IsFetchingHistoryMap> = handleActions({
  ['mvj/creditDecision/FETCH_HISTORY_BY_BUSINESS_ID']: (state: IsFetchingHistoryMap, {
    payload: id
  }: FetchHistoryByBusinessIdAction) => ({ ...state,
    [id]: true
  }),
  // @ts-ignore: No overload matches this call 
  ['mvj/creditDecision/RECEIVE_HISTORY_BY_BUSINESS_ID']: (state: IsFetchingHistoryMap, {
    payload
  }: ReceiveHistoryByBusinessIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/creditDecision/HISTORY_NOT_FOUND_BY_BUSINESS_ID']: (state: IsFetchingHistoryMap, {
    payload: id
  }: HistoryNotFoundByBusinessIdAction) => ({ ...state,
    [id]: false
  })
}, {});
const historyByBusinessIdReducer: Reducer<HistoryDataMap> = handleActions({
  ['mvj/creditDecision/RECEIVE_HISTORY_BY_BUSINESS_ID']: (state: HistoryDataMap, {
    payload
  }: ReceiveHistoryByBusinessIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingHistoryByContactIdReducer: Reducer<IsFetchingHistoryMap> = handleActions({
  ['mvj/creditDecision/FETCH_HISTORY_BY_CONTACT_ID']: (state: IsFetchingHistoryMap, {
    payload: id
  }: FetchHistoryByContactIdAction) => ({ ...state,
    [id]: true
  }),
  // @ts-ignore: No overload matches this call 
  ['mvj/creditDecision/RECEIVE_HISTORY_BY_CONTACT_ID']: (state: IsFetchingHistoryMap, {
    payload
  }: ReceiveHistoryByContactIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/creditDecision/HISTORY_NOT_FOUND_BY_CONTACT_ID']: (state: IsFetchingHistoryMap, {
    payload: id
  }: HistoryNotFoundByContactIdAction) => ({ ...state,
    [id]: false
  })
}, {});
const historyByContactIdReducer: Reducer<HistoryDataMap> = handleActions({
  ['mvj/creditDecision/RECEIVE_HISTORY_BY_CONTACT_ID']: (state: HistoryDataMap, {
    payload
  }: ReceiveHistoryByContactIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingCreditDecisionByBusinessIdReducer: Reducer<IsFetchingCreditDecisionMap> = handleActions({
  ['mvj/creditDecision/FETCH_CREDIT_DECISION_BY_BUSINESS_ID']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: FetchCreditDecisionByBusinessIdAction) => ({ ...state,
    [id]: true
  }),
  // @ts-ignore: No overload matches this call 
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_BUSINESS_ID']: (state: IsFetchingCreditDecisionMap, {
    payload
  }: ReceiveCreditDecisionByBusinessIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_BUSINESS_ID']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: CreditDecisionNotFoundByBusinessIdAction) => ({ ...state,
    [id]: false
  })
}, {});
const creditDecisionByBusinessIdReducer: Reducer<CreditDecisionDataMap> = handleActions({
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_BUSINESS_ID']: (state: CreditDecisionDataMap, {
    payload
  }: ReceiveCreditDecisionByBusinessIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingCreditDecisionByContactIdReducer: Reducer<IsFetchingCreditDecisionMap> = handleActions({
  ['mvj/creditDecision/FETCH_CREDIT_DECISION_BY_CONTACT_ID']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: FetchCreditDecisionByContactIdAction) => ({ ...state,
    [id]: true
  }),
  // @ts-ignore: No overload matches this call 
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_CONTACT_ID']: (state: IsFetchingCreditDecisionMap, {
    payload
  }: ReceiveCreditDecisionByContactIdAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_CONTACT_ID']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: CreditDecisionNotFoundByContactIdAction) => ({ ...state,
    [id]: false
  })
}, {});
const creditDecisionByContactIdReducer: Reducer<CreditDecisionDataMap> = handleActions({
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_CONTACT_ID']: (state: CreditDecisionDataMap, {
    payload
  }: ReceiveCreditDecisionByContactIdAction) => ({ ...state,
    ...payload
  })
}, {});
const isFetchingCreditDecisionByNinReducer: Reducer<IsFetchingCreditDecisionMap> = handleActions({
  ['mvj/creditDecision/FETCH_CREDIT_DECISION_BY_NIN']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: FetchCreditDecisionByNinAction) => ({ ...state,
    [id]: true
  }),
  // @ts-ignore: No overload matches this call 
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_NIN']: (state: IsFetchingCreditDecisionMap, {
    payload
  }: ReceiveCreditDecisionByNinAction) => ({ ...state,
    ...Object.keys(payload).reduce((obj, key) => ({ ...obj,
      [key]: false
    }), {})
  }),
  ['mvj/creditDecision/CREDIT_DECISION_NOT_FOUND_BY_NIN']: (state: IsFetchingCreditDecisionMap, {
    payload: id
  }: CreditDecisionNotFoundByNinAction) => ({ ...state,
    [id]: false
  })
}, {});
const creditDecisionByNinReducer: Reducer<CreditDecisionDataMap> = handleActions({
  ['mvj/creditDecision/RECEIVE_CREDIT_DECISION_BY_NIN']: (state: CreditDecisionDataMap, {
    payload
  }: ReceiveCreditDecisionByNinAction) => ({ ...state,
    ...payload
  })
}, {});
export default combineReducers<Record<string, any>, any>({
  creditDecisionByBusinessId: creditDecisionByBusinessIdReducer,
  creditDecisionByContactId: creditDecisionByContactIdReducer,
  creditDecisionByNin: creditDecisionByNinReducer,
  historyByBusinessId: historyByBusinessIdReducer,
  historyByContactId: historyByContactIdReducer,
  isFetchingCreditDecisionByBusinessId: isFetchingCreditDecisionByBusinessIdReducer,
  isFetchingCreditDecisionByContactId: isFetchingCreditDecisionByContactIdReducer,
  isFetchingCreditDecisionByNin: isFetchingCreditDecisionByNinReducer,
  isFetchingHistoryByBusinessId: isFetchingHistoryByBusinessIdReducer,
  isFetchingHistoryByContactId: isFetchingHistoryByContactIdReducer
});