// @flow

import {all, fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';
import billingPeriodsSaga from '../billingPeriods/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import decisionSaga from '../decision/saga';
import districtSaga from '../district/saga';
import infillDevelopmentSaga from '../infillDevelopment/saga';
import invoiceSaga from '../invoices/saga';
import leaseSaga from '../leases/saga';
import mapDataSaga from '../mapData/saga';
import noticePeriodSaga from '../noticePeriod/saga';
import rememberableTermSaga from '../rememberableTerms/saga';
import rentBasisSaga from '../rentbasis/saga';
import rentForPeriodSaga from '../rentForPeriod/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(authSaga),
      fork(billingPeriodsSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(decisionSaga),
      fork(districtSaga),
      fork(infillDevelopmentSaga),
      fork(invoiceSaga),
      fork(leaseSaga),
      fork(mapDataSaga),
      fork(noticePeriodSaga),
      fork(rememberableTermSaga),
      fork(rentBasisSaga),
      fork(rentForPeriodSaga),
      fork(userSaga),
    ]);
  };
