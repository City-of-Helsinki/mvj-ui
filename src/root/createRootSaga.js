// @flow

import {all, fork} from 'redux-saga/effects';
import areaNoteSaga from '../areaNote/saga';
import authSaga from '../auth/saga';
import billingPeriodsSaga from '../billingPeriods/saga';
import collectionLetterReducer from '../collectionLetter/saga';
import collectionLetterTemplateReducer from '../collectionLetterTemplate/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import debtCollectionSaga from '../debtCollection/saga';
import decisionSaga from '../decision/saga';
import districtSaga from '../district/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import invoiceSaga from '../invoices/saga';
import invoiceSetSaga from '../invoiceSets/saga';
import landUseContractSaga from '../landUseContract/saga';
import leaseSaga from '../leases/saga';
import mapDataSaga from '../mapData/saga';
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
      fork(collectionLetterReducer),
      fork(collectionLetterTemplateReducer),
      fork(commentSaga),
      fork(contactSaga),
      fork(debtCollectionSaga),
      fork(decisionSaga),
      fork(districtSaga),
      fork(infillDevelopmentSaga),
      fork(invoiceSaga),
      fork(invoiceSetSaga),
      fork(landUseContractSaga),
      fork(leaseSaga),
      fork(mapDataSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(userSaga),
    ]);
  };
