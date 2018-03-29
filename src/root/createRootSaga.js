// @flow

import {fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';
import billingSaga from '../leases/components/leaseSections/billing/saga';
import contactSaga from '../contacts/saga';
import leaseSaga from '../leases/saga';
import rentCriteriaSaga from '../rentcriterias/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(authSaga),
      fork(billingSaga),
      fork(contactSaga),
      fork(leaseSaga),
      fork(rentCriteriaSaga),
      fork(userSaga),
    ];
  };
