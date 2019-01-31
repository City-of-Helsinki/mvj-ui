// @flow

import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as oidc} from 'redux-oidc';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {connectRouter} from 'connected-react-router';
import apiReducer from '../api/reducer';
import areaNoteReducer from '../areaNote/reducer';
import authReducer from '../auth/reducer';
import billingPeriodReducer from '../billingPeriods/reducer';
import collectionCourtDecisionReducer from '../collectionCourtDecision/reducer';
import collectionLetterReducer from '../collectionLetter/reducer';
import collectionNoteReducer from '../collectionNote/reducer';
import commentsReducer from '../comments/reducer';
import contactsReducer from '../contacts/reducer';
import contractFileReducer from '$src/contractFile/reducer';
import copyAreasToContractReducer from '$src/copyAreasToContract/reducer';
import createCollectionLetterReducer from '$src/createCollectionLetter/reducer';
import districtsReducer from '../district/reducer';
import infillDevelopmentReducer from '$src/infillDevelopment/reducer';
import infillDevelopmentAttachmentReducer from '$src/infillDevelopmentAttachment/reducer';
import invoiceReducer from '$src/invoices/reducer';
import invoiceSetReducer from '$src/invoiceSets/reducer';
import landUseContractReducer from '$src/landUseContract/reducer';
import leaseReducer from '../leases/reducer';
import leaseCreateChargeReducer from '../leaseCreateCharge/reducer';
import leaseTypeReducer from '../leaseType/reducer';
import mapDataReducer from '../mapData/reducer';
import penaltyInterestReducer from '../penaltyInterest/reducer';
import previewInvoicesReducer from '../previewInvoices/reducer';
import rentBasisReducer from '../rentbasis/reducer';
import rentForPeriodReducer from '../rentForPeriod/reducer';
import topNavigationReducer from '$components/topNavigation/reducer';
import usersReducer from '../users/reducer';
import usersPermissionsReducer from '../usersPermissions/reducer';
import vatReducer from '../vat/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (history: Object): Reducer<RootState> =>
  combineReducers({
    api: apiReducer,
    areaNote: areaNoteReducer,
    auth: authReducer,
    billingPeriod: billingPeriodReducer,
    collectionCourtDecision: collectionCourtDecisionReducer,
    collectionLetter: collectionLetterReducer,
    collectionNote: collectionNoteReducer,
    comment: commentsReducer,
    contact: contactsReducer,
    contractFile: contractFileReducer,
    copyAreasToContract: copyAreasToContractReducer,
    createCollectionLetter: createCollectionLetterReducer,
    district: districtsReducer,
    form: formReducer,
    infillDevelopment: infillDevelopmentReducer,
    infillDevelopmentAttachment: infillDevelopmentAttachmentReducer,
    invoice: invoiceReducer,
    invoiceSet: invoiceSetReducer,
    landUseContract: landUseContractReducer,
    lease: leaseReducer,
    leaseCreateCharge: leaseCreateChargeReducer,
    leaseType: leaseTypeReducer,
    mapData: mapDataReducer,
    oidc,
    penaltyInterest: penaltyInterestReducer,
    previewInvoices: previewInvoicesReducer,
    rentBasis: rentBasisReducer,
    rentForPeriod: rentForPeriodReducer,
    router: connectRouter(history),
    toastr: toastrReducer,
    topNavigation: topNavigationReducer,
    user: usersReducer,
    usersPermissions: usersPermissionsReducer,
    vat: vatReducer,
  });
