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
import contactsReducer from "/src/contacts/reducer";
import contractFileReducer from "/src/contractFile/reducer";
import createCollectionLetterReducer from "/src/createCollectionLetter/reducer";
import creditDecisionReducer from "/src/creditDecision/reducer";
import leaseStatisticReportReducer from "/src/leaseStatisticReport/reducer";
import districtsReducer from "/src/district/reducer";
import indexReducer from "/src/index/reducer";
import infillDevelopmentReducer from "/src/infillDevelopment/reducer";
import infillDevelopmentAttachmentReducer from "/src/infillDevelopmentAttachment/reducer";
import invoiceReducer from "/src/invoices/reducer";
import invoiceNoteReducer from "/src/invoiceNote/reducer";
import invoiceSetReducer from "/src/invoiceSets/reducer";
import landUseInvoiceReducer from "/src/landUseInvoices/reducer";
import landUseContractReducer from "/src/landUseContract/reducer";
import landUseAgreementAttachmentReducer from "/src/landUseAgreementAttachment/reducer";
import leaseReducer from "/src/leases/reducer";
import plotSearchReducer from "/src/plotSearch/reducer";
import plotApplicationsReducer from "/src/plotApplications/reducer";
import applicationReducer from "/src/application/reducer";
import leaseCreateChargeReducer from "/src/leaseCreateCharge/reducer";
import leaseholdTransferReducer from "/src/leaseholdTransfer/reducer";
import leaseTypeReducer from "/src/leaseType/reducer";
import lessorReducer from "/src/lessor/reducer";
import penaltyInterestReducer from "/src/penaltyInterest/reducer";
import previewInvoicesReducer from "/src/previewInvoices/reducer";
import rentBasisReducer from "/src/rentbasis/reducer";
import rentForPeriodReducer from "/src/rentForPeriod/reducer";
import sapInvoiceReducer from "/src/sapInvoice/reducer";
import serviceUnitsReducer from "/src/serviceUnits/reducer";
import topNavigationReducer from "/src/components/topNavigation/reducer";
import tradeRegisterReducer from "/src/tradeRegister/reducer";
import uiDataReducer from "/src/uiData/reducer";
import usersReducer from "/src/users/reducer";
import usersPermissionsReducer from "/src/usersPermissions/reducer";
import vatReducer from "vat/reducer";
import type { Reducer } from "types";
import type { RootState } from "/src/root/types";
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