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
import copyAreasToContractSaga from '$src/copyAreasToContract/saga';
import createCollectionLetterSaga from '$src/createCollectionLetter/saga';
import districtSaga from '../district/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import infillDevelopmentAttachmentSaga from '../infillDevelopmentAttachment/saga';
import invoiceSaga from '../invoices/saga';
import invoiceCreditSaga from '../invoiceCredit/saga';
import invoiceSetSaga from '../invoiceSets/saga';
import invoiceSetCreditSaga from '../invoiceSetCredit/saga';
import landUseContractSaga from '../landUseContract/saga';
import leaseSaga from '../leases/saga';
import leaseCreateChargeSaga from '../leaseCreateCharge/saga';
import leaseTypeSaga from '../leaseType/saga';
import mapDataSaga from '../mapData/saga';
import penaltyInterestSaga from '../penaltyInterest/saga';
import previewInvoicesSaga from '../previewInvoices/saga';
import relatedLeaseSaga from '../relatedLease/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import setInvoicingStateSaga from '$src/setInvoicingState/saga';
import setRentInfoCompletionStateSaga from '$src/setRentInfoCompletionState/saga';
import userSaga from '../users/saga';
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
      fork(copyAreasToContractSaga),
      fork(createCollectionLetterSaga),
      fork(districtSaga),
      fork(infillDevelopmentSaga),
      fork(infillDevelopmentAttachmentSaga),
      fork(invoiceSaga),
      fork(invoiceCreditSaga),
      fork(invoiceSetSaga),
      fork(invoiceSetCreditSaga),
      fork(landUseContractSaga),
      fork(leaseSaga),
      fork(leaseCreateChargeSaga),
      fork(leaseTypeSaga),
      fork(mapDataSaga),
      fork(penaltyInterestSaga),
      fork(previewInvoicesSaga),
      fork(relatedLeaseSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(setInvoicingStateSaga),
      fork(setRentInfoCompletionStateSaga),
      fork(userSaga),
      fork(vatSaga),
    ]);
  };
