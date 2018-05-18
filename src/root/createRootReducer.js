// @flow

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as oidc} from 'redux-oidc';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {routerReducer} from 'react-router-redux';
import apiReducer from '../api/reducer';
import authReducer from '../auth/reducer';
import commentsReducer from '../comments/reducer';
import contactsReducer from '../contacts/reducer';
import decisionsReducer from '../decision/reducer';
import districtsReducer from '../district/reducer';
import invoiceReducer from '$src/invoices/reducer';
import leaseReducer from '../leases/reducer';
import mapDataReducer from '../mapData/reducer';
import noticePeriodReducer from '../noticePeriod/reducer';
import rememberableTermReducer from '../rememberableTerms/reducer';
import rentBasisReducer from '../rentbasis/reducer';
import topNavigationReducer from '$components/topNavigation/reducer';
import usersReducer from '../users/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (): Reducer<RootState> =>
  combineReducers({
    api: apiReducer,
    auth: authReducer,
    comment: commentsReducer,
    contacts: contactsReducer,
    decision: decisionsReducer,
    district: districtsReducer,
    form: formReducer,
    invoice: invoiceReducer,
    lease: leaseReducer,
    mapData: mapDataReducer,
    noticePeriod: noticePeriodReducer,
    oidc,
    rememberableterm: rememberableTermReducer,
    rentbasis: rentBasisReducer,
    routing: routerReducer,
    toastr: toastrReducer,
    topnavigation: topNavigationReducer,
    users: usersReducer,
  });
