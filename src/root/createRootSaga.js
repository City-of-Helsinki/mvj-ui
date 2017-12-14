// @flow

import {fork} from 'redux-saga/effects';
import attributeSaga from '../attributes/saga';
import authSaga from '../auth/saga';
import roleSaga from '../role/saga';
import applicationSaga from '../applications-alpha/saga';
import leaseSaga from '../leases-alpha/saga';
import leaseSagaBeta from '../leases/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(attributeSaga),
      fork(authSaga),
      fork(roleSaga),
      fork(applicationSaga),
      fork(leaseSaga),
      fork(leaseSagaBeta),
    ];
  };
