// @flow

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {routerReducer} from 'react-router-redux';
import apiReducer from '../api/reducer';
import roleReducer from '../role/reducer';
import attributesReducer from '../attributes/reducer';
import applicationsReducer from '../applications-alpha/reducer';
import leaseReducer from '../leases-alpha/reducer';
import leaseReducerBeta from '../leases/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (): Reducer<RootState> =>
  combineReducers({
    api: apiReducer,
    applications: applicationsReducer,
    attributes: attributesReducer,
    lease: leaseReducer,
    leasebeta: leaseReducerBeta,
    user: roleReducer,
    form: formReducer,
    routing: routerReducer,
    toastr: toastrReducer,
  });
