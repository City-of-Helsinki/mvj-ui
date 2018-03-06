// @flow

import {fork} from 'redux-saga/effects';
import attributeSaga from '../attributes/saga';
import authSaga from '../auth/saga';
import leaseSaga from '../leases/saga';
import rentCriteriaSaga from '../rentcriterias/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(attributeSaga),
      fork(authSaga),
      fork(leaseSaga),
      fork(rentCriteriaSaga),
    ];
  };
