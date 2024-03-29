// @flow
import {all, fork} from 'redux-saga/effects';

import areaNoteSaga from '$src/areaNote/saga';
import auditLogSaga from '$src/auditLog/saga';
import authSaga from '$src/auth/saga';
import areaSearchSaga from '$src/areaSearch/saga';
import batchrunSaga from '$src/batchrun/saga';
import billingPeriodsSaga from '$src/billingPeriods/saga';
import collectionCourtDecisionSaga from '$src/collectionCourtDecision/saga';
import collectionLetterSaga from '$src/collectionLetter/saga';
import collectionNoteSaga from '$src/collectionNote/saga';
import commentSaga from '$src/comments/saga';
import contactSaga from '$src/contacts/saga';
import contractFileSaga from '$src/contractFile/saga';
import createCollectionLetterSaga from '$src/createCollectionLetter/saga';
import creditDecisionSaga from '$src/creditDecision/saga';
import districtSaga from '$src/district/saga';
import indexSaga from '$src/index/saga';
import infillDevelopmentSaga from '$src/infillDevelopment/saga';
import infillDevelopmentAttachmentSaga from '$src/infillDevelopmentAttachment/saga';
import invoiceSaga from '$src/invoices/saga';
import landUseinvoiceSaga from '$src/landUseInvoices/saga';
import invoiceNoteSaga from '$src/invoiceNote/saga';
import invoiceSetSaga from '$src/invoiceSets/saga';
import landUseContractSaga from '$src/landUseContract/saga';
import landUseAgreementAttachmentSaga from '$src/landUseAgreementAttachment/saga';
import leaseSaga from '$src/leases/saga';
import leaseAreaAttachmentSaga from '$src/leaseAreaAttachment/saga';
import leaseInspectionAttachmentSaga from '$src/leaseInspectionAttachment/saga';
import leaseCreateChargeSaga from '$src/leaseCreateCharge/saga';
import leaseholdTransferSaga from '$src/leaseholdTransfer/saga';
import leaseStatisticReportSaga from '$src/leaseStatisticReport/saga';
import leaseTypeSaga from '$src/leaseType/saga';
import lessorSaga from '$src/lessor/saga';
import penaltyInterestSaga from '$src/penaltyInterest/saga';
import previewInvoicesSaga from '$src/previewInvoices/saga';
import relatedLeaseSaga from '$src/relatedLease/saga';
import rentBasisSaga from '$src/rentbasis/saga';
import rentForPeriodSaga from '$src/rentForPeriod/saga';
import sapInvoicesSaga from '$src/sapInvoice/saga';
import tradeRegisterSaga from '$src/tradeRegister/saga';
import uiDataSaga from '$src/uiData/saga';
import userSaga from '$src/users/saga';
import usersPermissionsSaga from '$src/usersPermissions/saga';
import vatSaga from '$src/vat/saga';
import plotSearchSaga from '$src/plotSearch/saga';
import plotApplicationsSaga from '$src/plotApplications/saga';
import applicationSaga from '$src/application/saga';


// $FlowFixMe
export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
      fork(areaSearchSaga),
      fork(auditLogSaga),
      fork(authSaga),
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
      fork(landUseinvoiceSaga),
      fork(invoiceNoteSaga),
      fork(invoiceSetSaga),
      fork(landUseContractSaga),
      fork(landUseAgreementAttachmentSaga),
      fork(leaseSaga),
      fork(leaseAreaAttachmentSaga),
      fork(leaseCreateChargeSaga),
      fork(leaseholdTransferSaga),
      fork(leaseInspectionAttachmentSaga),
      fork(leaseStatisticReportSaga),
      fork(leaseTypeSaga),
      fork(lessorSaga),
      fork(penaltyInterestSaga),
      fork(previewInvoicesSaga),
      fork(relatedLeaseSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(sapInvoicesSaga),
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
