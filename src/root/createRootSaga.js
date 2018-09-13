// @flow

import {all, fork} from 'redux-saga/effects';
import areaNoteSaga from '../areaNote/saga';
import authSaga from '../auth/saga';
import billingPeriodsSaga from '../billingPeriods/saga';
import collectionCourtDecisionSaga from '../collectionCourtDecision/saga';
import collectionLetterSaga from '../collectionLetter/saga';
import collectionLetterTemplateSaga from '../collectionLetterTemplate/saga';
import collectionNoteSaga from '../collectionNote/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import decisionSaga from '../decision/saga';
import districtSaga from '../district/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import invoiceSaga from '../invoices/saga';
import invoiceSetSaga from '../invoiceSets/saga';
import landUseContractSaga from '../landUseContract/saga';
import leaseSaga from '../leases/saga';
import mapDataSaga from '../mapData/saga';
import penaltyInterestSaga from '../penaltyInterest/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(areaNoteSaga),
      fork(authSaga),
      fork(billingPeriodsSaga),
      fork(collectionCourtDecisionSaga),
      fork(collectionLetterSaga),
      fork(collectionLetterTemplateSaga),
      fork(collectionNoteSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(decisionSaga),
      fork(districtSaga),
      fork(infillDevelopmentSaga),
      fork(invoiceSaga),
      fork(invoiceSetSaga),
      fork(landUseContractSaga),
      fork(leaseSaga),
      fork(mapDataSaga),
      fork(penaltyInterestSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(userSaga),
    ]);
  };
