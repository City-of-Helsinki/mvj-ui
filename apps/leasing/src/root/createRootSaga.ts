import { all, fork } from "redux-saga/effects";
import areaNoteSaga from "@/areaNote/saga";
import auditLogSaga from "@/auditLog/saga";
import areaSearchSaga from "@/areaSearch/saga";
import batchrunSaga from "@/batchrun/saga";
import billingPeriodsSaga from "@/billingPeriods/saga";
import collectionCourtDecisionSaga from "@/collectionCourtDecision/saga";
import collectionLetterSaga from "@/collectionLetter/saga";
import collectionNoteSaga from "@/collectionNote/saga";
import commentSaga from "@/comments/saga";
import contactSaga from "@/contacts/saga";
import contractFileSaga from "@/contractFile/saga";
import createCollectionLetterSaga from "@/createCollectionLetter/saga";
import creditDecisionSaga from "@/creditDecision/saga";
import districtSaga from "@/district/saga";
import indexSaga from "@/index/saga";
import infillDevelopmentSaga from "@/infillDevelopment/saga";
import infillDevelopmentAttachmentSaga from "@/infillDevelopmentAttachment/saga";
import invoiceSaga from "@/invoices/saga";
import invoiceNoteSaga from "@/invoiceNote/saga";
import invoiceSetSaga from "@/invoiceSets/saga";
import leaseSaga from "@/leases/saga";
import leaseAreaAttachmentSaga from "@/leaseAreaAttachment/saga";
import leaseInspectionAttachmentSaga from "@/leaseInspectionAttachment/saga";
import leaseCreateChargeSaga from "@/leaseCreateCharge/saga";
import leaseholdTransferSaga from "@/leaseholdTransfer/saga";
import leaseStatisticReportSaga from "@/leaseStatisticReport/saga";
import leaseTypeSaga from "@/leaseType/saga";
import lessorSaga from "@/lessor/saga";
import oldDwellingsInHousingCompaniesPriceIndexSaga from "@/oldDwellingsInHousingCompaniesPriceIndex/saga";
import penaltyInterestSaga from "@/penaltyInterest/saga";
import previewInvoicesSaga from "@/previewInvoices/saga";
import relatedLeaseSaga from "@/relatedLease/saga";
import rentBasisSaga from "@/rentbasis/saga";
import rentForPeriodSaga from "@/rentForPeriod/saga";
import sapInvoicesSaga from "@/sapInvoice/saga";
import serviceUnitsSaga from "@/serviceUnits/saga";
import tradeRegisterSaga from "@/tradeRegister/saga";
import uiDataSaga from "@/uiData/saga";
import userSaga from "@/users/saga";
import usersPermissionsSaga from "@/usersPermissions/saga";
import vatSaga from "@/vat/saga";
import plotSearchSaga from "@/plotSearch/saga";
import plotApplicationsSaga from "@/plotApplications/saga";
import applicationSaga from "@/application/saga";

export default () =>
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
      fork(areaSearchSaga),
      fork(auditLogSaga),
      fork(batchrunSaga),
      fork(billingPeriodsSaga),
      fork(collectionCourtDecisionSaga),
      fork(collectionLetterSaga),
      fork(collectionNoteSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(contractFileSaga),
      fork(createCollectionLetterSaga),
      fork(creditDecisionSaga),
      fork(districtSaga),
      fork(indexSaga),
      fork(infillDevelopmentSaga),
      fork(infillDevelopmentAttachmentSaga),
      fork(invoiceSaga),
      fork(invoiceNoteSaga),
      fork(invoiceSetSaga),
      fork(leaseSaga),
      fork(leaseAreaAttachmentSaga),
      fork(leaseCreateChargeSaga),
      fork(leaseholdTransferSaga),
      fork(leaseInspectionAttachmentSaga),
      fork(leaseStatisticReportSaga),
      fork(leaseTypeSaga),
      fork(lessorSaga),
      fork(oldDwellingsInHousingCompaniesPriceIndexSaga),
      fork(penaltyInterestSaga),
      fork(previewInvoicesSaga),
      fork(relatedLeaseSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(sapInvoicesSaga),
      fork(serviceUnitsSaga),
      fork(tradeRegisterSaga),
      fork(uiDataSaga),
      fork(userSaga),
      fork(usersPermissionsSaga),
      fork(vatSaga),
      fork(plotSearchSaga),
      fork(plotApplicationsSaga),
      fork(applicationSaga),
    ]);
  };
