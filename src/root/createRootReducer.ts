import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as oidc } from "redux-oidc";
import { reducer as toastrReducer } from "react-redux-toastr";
import { connectRouter } from "connected-react-router";
import apiReducer from "/src/api/reducer";
import areaNoteReducer from "/src/areaNote/reducer";
import areaSearchReducer from "/src/areaSearch/reducer";
import auditLogReducer from "/src/auditLog/reducer";
import authReducer from "/src/auth/reducer";
import batchrunReducer from "/src/batchrun/reducer";
import billingPeriodReducer from "/src/billingPeriods/reducer";
import collectionCourtDecisionReducer from "/src/collectionCourtDecision/reducer";
import collectionLetterReducer from "/src/collectionLetter/reducer";
import collectionNoteReducer from "/src/collectionNote/reducer";
import commentsReducer from "/src/comments/reducer";
import contactsReducer from "contacts/reducer";
import contractFileReducer from "contractFile/reducer";
import createCollectionLetterReducer from "createCollectionLetter/reducer";
import creditDecisionReducer from "creditDecision/reducer";
import leaseStatisticReportReducer from "leaseStatisticReport/reducer";
import districtsReducer from "district/reducer";
import indexReducer from "index/reducer";
import infillDevelopmentReducer from "infillDevelopment/reducer";
import infillDevelopmentAttachmentReducer from "infillDevelopmentAttachment/reducer";
import invoiceReducer from "invoices/reducer";
import invoiceNoteReducer from "invoiceNote/reducer";
import invoiceSetReducer from "invoiceSets/reducer";
import landUseInvoiceReducer from "landUseInvoices/reducer";
import landUseContractReducer from "landUseContract/reducer";
import landUseAgreementAttachmentReducer from "landUseAgreementAttachment/reducer";
import leaseReducer from "leases/reducer";
import plotSearchReducer from "plotSearch/reducer";
import plotApplicationsReducer from "plotApplications/reducer";
import applicationReducer from "/src/application/reducer";
import leaseCreateChargeReducer from "leaseCreateCharge/reducer";
import leaseholdTransferReducer from "leaseholdTransfer/reducer";
import leaseTypeReducer from "leaseType/reducer";
import lessorReducer from "lessor/reducer";
import penaltyInterestReducer from "penaltyInterest/reducer";
import previewInvoicesReducer from "previewInvoices/reducer";
import rentBasisReducer from "rentbasis/reducer";
import rentForPeriodReducer from "rentForPeriod/reducer";
import sapInvoiceReducer from "sapInvoice/reducer";
import serviceUnitsReducer from "serviceUnits/reducer";
import topNavigationReducer from "/src/components/topNavigation/reducer";
import tradeRegisterReducer from "tradeRegister/reducer";
import uiDataReducer from "uiData/reducer";
import usersReducer from "users/reducer";
import usersPermissionsReducer from "usersPermissions/reducer";
import vatReducer from "vat/reducer";
import type { Reducer } from "types";
import type { RootState } from "root/types";
export default ((history: Record<string, any>): Reducer<RootState> => combineReducers<Record<string, any>, any>({
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
  oidc,
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
  vat: vatReducer
}));