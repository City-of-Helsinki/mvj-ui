// @flow
import {all, fork} from 'redux-saga/effects';
import areaNoteSaga from '../areaNote/saga';
import auditLogSaga from '$src/auditLog/saga';
import authSaga from '../auth/saga';
import billingPeriodsSaga from '../billingPeriods/saga';
import collectionCourtDecisionSaga from '../collectionCourtDecision/saga';
import collectionLetterSaga from '../collectionLetter/saga';
import collectionNoteSaga from '../collectionNote/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import contractFileSaga from '$src/contractFile/saga';
import copyAreasToContractSaga from '$src/copyAreasToContract/saga';
import createCollectionLetterSaga from '$src/createCollectionLetter/saga';
import districtSaga from '../district/saga';
import indexSaga from '$src/index/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import infillDevelopmentAttachmentSaga from '../infillDevelopmentAttachment/saga';
import invoiceSaga from '../invoices/saga';
import invoiceNoteSaga from '../invoiceNote/saga';
import invoiceSetSaga from '../invoiceSets/saga';
import landUseContractSaga from '../landUseContract/saga';
import leaseSaga from '../leases/saga';
import leaseAreaAttachmentSaga from '$src/leaseAreaAttachment/saga';
import leaseInspectionAttachmentSaga from '$src/leaseInspectionAttachment/saga';
import leaseCreateChargeSaga from '../leaseCreateCharge/saga';
import leaseholdTransferSaga from '$src/leaseholdTransfer/saga';
import leaseTypeSaga from '../leaseType/saga';
import lessorSaga from '$src/lessor/saga';
import mapDataSaga from '../mapData/saga';
import penaltyInterestSaga from '../penaltyInterest/saga';
import previewInvoicesSaga from '../previewInvoices/saga';
import relatedLeaseSaga from '../relatedLease/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import sapInvoicesSaga from '$src/sapInvoice/saga';
import tradeRegisterSaga from '$src/tradeRegister/saga';
import uiDataSaga from '$src/uiData/saga';
import userSaga from '../users/saga';
import usersPermissionsSaga from '../usersPermissions/saga';
import vatSaga from '../vat/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
      fork(auditLogSaga),
      fork(authSaga),
      fork(billingPeriodsSaga),
      fork(collectionCourtDecisionSaga),
      fork(collectionLetterSaga),
      fork(collectionNoteSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(contractFileSaga),
      fork(copyAreasToContractSaga),
      fork(createCollectionLetterSaga),
      fork(districtSaga),
      fork(indexSaga),
      fork(infillDevelopmentSaga),
      fork(infillDevelopmentAttachmentSaga),
      fork(invoiceSaga),
      fork(invoiceNoteSaga),
      fork(invoiceSetSaga),
      fork(landUseContractSaga),
      fork(leaseSaga),
      fork(leaseAreaAttachmentSaga),
      fork(leaseCreateChargeSaga),
      fork(leaseholdTransferSaga),
      fork(leaseInspectionAttachmentSaga),
      fork(leaseTypeSaga),
      fork(lessorSaga),
      fork(mapDataSaga),
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
    ]);
  };
