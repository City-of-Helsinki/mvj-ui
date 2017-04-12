// @flow

import {fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(authSaga),
    ];
  };
