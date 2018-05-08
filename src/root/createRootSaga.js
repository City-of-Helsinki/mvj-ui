// @flow

import {all, fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';
import commentSaga from '../comments/saga';
import contactSaga from '../contacts/saga';
import decisionSaga from '../decision/saga';
import districtSaga from '../district/saga';
import invoiceSaga from '../invoices/saga';
import leaseSaga from '../leases/saga';
import noticePeriodSaga from '../noticePeriod/saga';
import rentBasisSaga from '../rentbasis/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield all([
      fork(authSaga),
      fork(commentSaga),
      fork(contactSaga),
      fork(decisionSaga),
      fork(districtSaga),
      fork(invoiceSaga),
      fork(leaseSaga),
      fork(noticePeriodSaga),
      fork(rentBasisSaga),
      fork(userSaga),
    ]);
  };
