
// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import type {Attributes, Reducer, Methods} from '$src/types';

import type {
  ReceivePlotApplicationsListAction,
  PlotApplicationsList,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
} from '$src/plotApplications/types';


const isFetchingReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ALL']: () => true,
  ['mvj/plotApplications/RECEIVE_ALL']: () => false,
}, false);

const plotApplicationsListReducer: Reducer<PlotApplicationsList> = handleActions({
  ['mvj/plotApplications/RECEIVE_ALL']: (state: PlotApplicationsList, {payload: list}: ReceivePlotApplicationsListAction) => list,
}, {});

const attributesReducer: Reducer<Attributes> = handleActions({
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: (state: Attributes, {payload: attributes}: ReceiveAttributesAction) => {
    return attributes;
  },
}, null);

const methodsReducer: Reducer<Methods> = handleActions({
  ['mvj/plotApplications/RECEIVE_METHODS']: (state: Methods, {payload: methods}: ReceiveMethodsAction) => {
    return methods;
  },
}, null);

const isFetchingAttributesReducer: Reducer<boolean> = handleActions({
  ['mvj/plotApplications/FETCH_ATTRIBUTES']: () => true,
  ['mvj/plotApplications/RECEIVE_ATTRIBUTES']: () => false,
  ['mvj/plotApplications/ATTRIBUTES_NOT_FOUND']: () => false,
  ['mvj/plotApplications/RECEIVE_METHODS']: () => false,
}, false);

export default combineReducers<Object, any>({
  isFetching: isFetchingReducer,
  list: plotApplicationsListReducer,
  attributes: attributesReducer,
  methods: methodsReducer,
  isFetchingAttributes: isFetchingAttributesReducer,
});
