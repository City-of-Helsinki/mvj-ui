// @flow
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {reducer as oidc} from 'redux-oidc';
import {reducer as toastrReducer} from 'react-redux-toastr';
import {connectRouter} from 'connected-react-router';
import apiReducer from '../api/reducer';
import areaNoteReducer from '../areaNote/reducer';
import auditLogReducer from '$src/auditLog/reducer';
import authReducer from '../auth/reducer';
import batchrunReducer from '$src/batchrun/reducer';
import billingPeriodReducer from '../billingPeriods/reducer';
import collectionCourtDecisionReducer from '../collectionCourtDecision/reducer';
import collectionLetterReducer from '../collectionLetter/reducer';
import collectionNoteReducer from '../collectionNote/reducer';
import commentsReducer from '../comments/reducer';
import contactsReducer from '../contacts/reducer';
import contractFileReducer from '$src/contractFile/reducer';
import createCollectionLetterReducer from '$src/createCollectionLetter/reducer';
import creditDecisionReducer from '$src/creditDecision/reducer';
import leaseStatisticReportReducer from '$src/leaseStatisticReport/reducer';
import districtsReducer from '../district/reducer';
import indexReducer from '$src/index/reducer';
import infillDevelopmentReducer from '$src/infillDevelopment/reducer';
import infillDevelopmentAttachmentReducer from '$src/infillDevelopmentAttachment/reducer';
import invoiceReducer from '$src/invoices/reducer';
import invoiceNoteReducer from '$src/invoiceNote/reducer';
import invoiceSetReducer from '$src/invoiceSets/reducer';
import landUseInvoiceReducer from '$src/landUseInvoices/reducer';
import landUseContractReducer from '$src/landUseContract/reducer';
import landUseAgreementAttachmentReducer from '$src/landUseAgreementAttachment/reducer';
import leaseReducer from '../leases/reducer';
import plotSearchReducer from '../plotSearch/reducer';
import plotApplicationsReducer from '../plotApplications/reducer';
import leaseCreateChargeReducer from '../leaseCreateCharge/reducer';
import leaseholdTransferReducer from '$src/leaseholdTransfer/reducer';
import leaseTypeReducer from '../leaseType/reducer';
import lessorReducer from '$src/lessor/reducer';
import penaltyInterestReducer from '../penaltyInterest/reducer';
import previewInvoicesReducer from '../previewInvoices/reducer';
import rentBasisReducer from '../rentbasis/reducer';
import rentForPeriodReducer from '../rentForPeriod/reducer';
import sapInvoiceReducer from '$src/sapInvoice/reducer';
import topNavigationReducer from '$components/topNavigation/reducer';
import tradeRegisterReducer from '$src/tradeRegister/reducer';
import uiDataReducer from '$src/uiData/reducer';
import usersReducer from '../users/reducer';
import usersPermissionsReducer from '../usersPermissions/reducer';
import vatReducer from '../vat/reducer';

import type {Reducer} from '../types';
import type {RootState} from './types';

export default (history: Object): Reducer<RootState> =>
  combineReducers<Object, any>({
    api: apiReducer,
    areaNote: areaNoteReducer,
    auditLog: auditLogReducer,
    auth: authReducer,
    batchrun: batchrunReducer,
    billingPeriod: billingPeriodReducer,
    collectionCourtDecision: collectionCourtDecisionReducer,
    collectionLetter: collectionLetterReducer,
    collectionNote: collectionNoteReducer,
    comment: commentsReducer,
    contact: contactsReducer,
    contractFile: contractFileReducer,
    createCollectionLetter: createCollectionLetterReducer,
    creditDecision: creditDecisionReducer,
    district: districtsReducer,
    form: formReducer,
    index: indexReducer,
    infillDevelopment: infillDevelopmentReducer,
    infillDevelopmentAttachment: infillDevelopmentAttachmentReducer,
    invoice: invoiceReducer,
    invoiceNote: invoiceNoteReducer,
    invoiceSet: invoiceSetReducer,
    landUseContract: landUseContractReducer,
    landUseAgreementAttachment: landUseAgreementAttachmentReducer,
    landUseInvoice: landUseInvoiceReducer,
    lease: leaseReducer,
    plotSearch: plotSearchReducer,
    plotApplications: plotApplicationsReducer,
    leaseCreateCharge: leaseCreateChargeReducer,
    leaseholdTransfer: leaseholdTransferReducer,
    leaseStatisticReport: leaseStatisticReportReducer,
    leaseType: leaseTypeReducer,
    lessor: lessorReducer,
    oidc,
    penaltyInterest: penaltyInterestReducer,
    previewInvoices: previewInvoicesReducer,
    rentBasis: rentBasisReducer,
    rentForPeriod: rentForPeriodReducer,
    router: connectRouter(history),
    sapInvoice: sapInvoiceReducer,
    toastr: toastrReducer,
    topNavigation: topNavigationReducer,
    tradeRegister: tradeRegisterReducer,
    uiData: uiDataReducer,
    user: usersReducer,
    usersPermissions: usersPermissionsReducer,
    vat: vatReducer,
  });
