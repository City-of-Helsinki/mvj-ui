// @flow
import {all, fork} from 'redux-saga/effects';
import areaNoteSaga from '../areaNote/saga';
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
import invoiceSetSaga from '../invoiceSets/saga';
import landUseContractSaga from '../landUseContract/saga';
import leaseSaga from '../leases/saga';
import leaseCreateChargeSaga from '../leaseCreateCharge/saga';
import leaseTypeSaga from '../leaseType/saga';
import lessorSaga from '$src/lessor/saga';
import mapDataSaga from '../mapData/saga';
import penaltyInterestSaga from '../penaltyInterest/saga';
import previewInvoicesSaga from '../previewInvoices/saga';
import relatedLeaseSaga from '../relatedLease/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import uiDataSaga from '$src/uiData/saga';
import userSaga from '../users/saga';
import usersPermissionsSaga from '../usersPermissions/saga';
import vatSaga from '../vat/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
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
      fork(invoiceSetSaga),
      fork(landUseContractSaga),
      fork(leaseSaga),
      fork(leaseCreateChargeSaga),
      fork(leaseTypeSaga),
      fork(lessorSaga),
      fork(mapDataSaga),
      fork(penaltyInterestSaga),
      fork(previewInvoicesSaga),
      fork(relatedLeaseSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(uiDataSaga),
      fork(userSaga),
      fork(usersPermissionsSaga),
      fork(vatSaga),
    ]);
  };
