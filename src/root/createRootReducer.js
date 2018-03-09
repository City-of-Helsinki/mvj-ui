// @flow

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as oidc} from 'redux-oidc';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {routerReducer} from 'react-router-redux';
import apiReducer from '../api/reducer';
import authReducer from '../auth/reducer';
import roleReducer from '../role/reducer';
import attributesReducer from '../attributes/reducer';
import billingReducer from '../leases/components/leaseSections/billing/reducer';
import leaseReducer from '../leases/reducer';
import rentCriteriasReducer from '../rentcriterias/reducer';
import topNavigationReducer from '$components/topNavigation/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (): Reducer<RootState> =>
  combineReducers({
    api: apiReducer,
    auth: authReducer,
    attributes: attributesReducer,
    billing: billingReducer,
    form: formReducer,
    lease: leaseReducer,
    oidc,
    rentcriteria: rentCriteriasReducer,
    routing: routerReducer,
    toastr: toastrReducer,
    topnavigation: topNavigationReducer,
    user: roleReducer,
  });
