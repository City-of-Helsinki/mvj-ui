// @flow
import {all, fork} from 'redux-saga/effects';
import areaNoteSaga from '../areaNote/saga';
import auditLogSaga from '$src/auditLog/saga';
import authSaga from '../auth/saga';
import batchrunSaga from '$src/batchrun/saga';
import billingPeriodsSaga from '../billingPeriods/saga';
import collectionCourtDecisionSaga from '../collectionCourtDecision/saga';
import collectionLetterSaga from '../collectionLetter/saga';
import collectionNoteSaga from '../collectionNote/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import contractFileSaga from '$src/contractFile/saga';
import createCollectionLetterSaga from '$src/createCollectionLetter/saga';
import creditDecisionSaga from '$src/creditDecision/saga';
import districtSaga from '../district/saga';
import indexSaga from '$src/index/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import infillDevelopmentAttachmentSaga from '../infillDevelopmentAttachment/saga';
import invoiceSaga from '../invoices/saga';
import landUseinvoiceSaga from '$src/landUseInvoices/saga';
import invoiceNoteSaga from '../invoiceNote/saga';
import invoiceSetSaga from '../invoiceSets/saga';
import landUseContractSaga from '../landUseContract/saga';
import landUseAgreementAttachmentSaga from '../landUseAgreementAttachment/saga';
import leaseSaga from '../leases/saga';
import leaseAreaAttachmentSaga from '$src/leaseAreaAttachment/saga';
import leaseInspectionAttachmentSaga from '$src/leaseInspectionAttachment/saga';
import leaseCreateChargeSaga from '../leaseCreateCharge/saga';
import leaseholdTransferSaga from '$src/leaseholdTransfer/saga';
import leaseStatisticReportSaga from '$src/leaseStatisticReport/saga';
import leaseTypeSaga from '../leaseType/saga';
import lessorSaga from '$src/lessor/saga';
import penaltyInterestSaga from '../penaltyInterest/saga';
import previewInvoicesSaga from '../previewInvoices/saga';
import relatedLeaseSaga from '../relatedLease/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import sapInvoicesSaga from '$src/sapInvoice/saga';
import serviceUnitsSaga from '$src/serviceUnits/saga';
import tradeRegisterSaga from '$src/tradeRegister/saga';
import uiDataSaga from '$src/uiData/saga';
import userSaga from '../users/saga';
import usersPermissionsSaga from '../usersPermissions/saga';
import vatSaga from '../vat/saga';
import plotSearchSaga from '../plotSearch/saga';
import plotApplicationsSaga from '../plotApplications/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
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
      fork(serviceUnitsSaga),
      fork(tradeRegisterSaga),
      fork(uiDataSaga),
      fork(userSaga),
      fork(usersPermissionsSaga),
      fork(vatSaga),
      fork(plotSearchSaga),
      fork(plotApplicationsSaga),
    ]);
  };
