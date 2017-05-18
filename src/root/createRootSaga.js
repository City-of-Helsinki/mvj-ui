// @flow

import {fork} from 'redux-saga/effects';
import attributeSaga from '../attributes/saga';
import roleSaga from '../role/saga';
import applicationSaga from '../applications/saga';
import leaseSaga from '../leases/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(attributeSaga),
      fork(roleSaga),
      fork(applicationSaga),
      fork(leaseSaga),
    ];
  };
