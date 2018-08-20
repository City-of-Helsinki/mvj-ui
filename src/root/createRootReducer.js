// @flow

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as oidc} from 'redux-oidc';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {routerReducer} from 'react-router-redux';
import apiReducer from '../api/reducer';
import areaNoteReducer from '../areaNote/reducer';
import authReducer from '../auth/reducer';
import billingPeriodsReducer from '../billingPeriods/reducer';
import commentsReducer from '../comments/reducer';
import contactsReducer from '../contacts/reducer';
import decisionsReducer from '../decision/reducer';
import districtsReducer from '../district/reducer';
import infillDevelopmentReducer from '$src/infillDevelopment/reducer';
import invoiceReducer from '$src/invoices/reducer';
import invoiceSetReducer from '$src/invoiceSets/reducer';
import landUseContractReducer from '$src/landUseContract/reducer';
import leaseReducer from '../leases/reducer';
import mapDataReducer from '../mapData/reducer';
import rentBasisReducer from '../rentbasis/reducer';
import rentForPeriodReducer from '../rentForPeriod/reducer';
import topNavigationReducer from '$components/topNavigation/reducer';
import usersReducer from '../users/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (): Reducer<RootState> =>
  combineReducers({
    api: apiReducer,
    areaNote: areaNoteReducer,
    auth: authReducer,
    billingPeriods: billingPeriodsReducer,
    comment: commentsReducer,
    contacts: contactsReducer,
    decision: decisionsReducer,
    district: districtsReducer,
    form: formReducer,
    infillDevelopment: infillDevelopmentReducer,
    invoice: invoiceReducer,
    invoiceSet: invoiceSetReducer,
    landUseContract: landUseContractReducer,
    lease: leaseReducer,
    mapData: mapDataReducer,
    oidc,
    rentBasis: rentBasisReducer,
    rentForPeriod: rentForPeriodReducer,
    routing: routerReducer,
    toastr: toastrReducer,
    topNavigation: topNavigationReducer,
    users: usersReducer,
  });
