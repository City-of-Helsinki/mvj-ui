import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as toastrReducer } from "react-redux-toastr";
import { connectRouter } from "connected-react-router";
import apiReducer from "@/api/reducer";
import areaNoteReducer from "@/areaNote/reducer";
import areaSearchReducer from "@/areaSearch/reducer";
import auditLogReducer from "@/auditLog/reducer";
import { authReducer } from "@/auth/reducer";
import batchrunReducer from "@/batchrun/reducer";
import billingPeriodReducer from "@/billingPeriods/reducer";
import collectionCourtDecisionReducer from "@/collectionCourtDecision/reducer";
import collectionLetterReducer from "@/collectionLetter/reducer";
import collectionNoteReducer from "@/collectionNote/reducer";
import commentsReducer from "@/comments/reducer";
import contactsReducer from "@/contacts/reducer";
import contractFileReducer from "@/contractFile/reducer";
import createCollectionLetterReducer from "@/createCollectionLetter/reducer";
import creditDecisionReducer from "@/creditDecision/reducer";
import leaseStatisticReportReducer from "@/leaseStatisticReport/reducer";
import districtsReducer from "@/district/reducer";
import indexReducer from "@/index/reducer";
import infillDevelopmentReducer from "@/infillDevelopment/reducer";
import infillDevelopmentAttachmentReducer from "@/infillDevelopmentAttachment/reducer";
import invoiceReducer from "@/invoices/reducer";
import invoiceNoteReducer from "@/invoiceNote/reducer";
import invoiceSetReducer from "@/invoiceSets/reducer";
import landUseInvoiceReducer from "@/landUseInvoices/reducer";
import landUseContractReducer from "@/landUseContract/reducer";
import landUseAgreementAttachmentReducer from "@/landUseAgreementAttachment/reducer";
import leaseReducer from "@/leases/reducer";
import periodicRentAdjustmentPriceIndexReducer from "@/periodicRentAdjustmentPriceIndex/reducer";
import plotSearchReducer from "@/plotSearch/reducer";
import plotApplicationsReducer from "@/plotApplications/reducer";
import applicationReducer from "@/application/reducer";
import leaseCreateChargeReducer from "@/leaseCreateCharge/reducer";
import leaseholdTransferReducer from "@/leaseholdTransfer/reducer";
import leaseTypeReducer from "@/leaseType/reducer";
import lessorReducer from "@/lessor/reducer";
import penaltyInterestReducer from "@/penaltyInterest/reducer";
import previewInvoicesReducer from "@/previewInvoices/reducer";
import rentBasisReducer from "@/rentbasis/reducer";
import rentForPeriodReducer from "@/rentForPeriod/reducer";
import sapInvoiceReducer from "@/sapInvoice/reducer";
import serviceUnitsReducer from "@/serviceUnits/reducer";
import topNavigationReducer from "@/components/topNavigation/reducer";
import tradeRegisterReducer from "@/tradeRegister/reducer";
import uiDataReducer from "@/uiData/reducer";
import usersReducer from "@/users/reducer";
import usersPermissionsReducer from "@/usersPermissions/reducer";
import vatReducer from "@/vat/reducer";
import type { Reducer } from "@/types";
import type { RootState } from "@/root/types";
export default (history: Record<string, any>): Reducer<RootState> =>
  combineReducers<Record<string, any>, any>({
    api: apiReducer,
    areaNote: areaNoteReducer,
    areaSearch: areaSearchReducer,
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
    application: applicationReducer,
    leaseCreateCharge: leaseCreateChargeReducer,
    leaseholdTransfer: leaseholdTransferReducer,
    leaseStatisticReport: leaseStatisticReportReducer,
    leaseType: leaseTypeReducer,
    lessor: lessorReducer,
    periodicRentAdjustmentPriceIndex: periodicRentAdjustmentPriceIndexReducer,
    penaltyInterest: penaltyInterestReducer,
    previewInvoices: previewInvoicesReducer,
    rentBasis: rentBasisReducer,
    rentForPeriod: rentForPeriodReducer,
    router: connectRouter(history),
    serviceUnits: serviceUnitsReducer,
    sapInvoice: sapInvoiceReducer,
    toastr: toastrReducer,
    topNavigation: topNavigationReducer,
    tradeRegister: tradeRegisterReducer,
    uiData: uiDataReducer,
    user: usersReducer,
    usersPermissions: usersPermissionsReducer,
    vat: vatReducer,
  });
