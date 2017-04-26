// @flow

import {fork} from 'redux-saga/effects';
import roleSaga from '../role/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(roleSaga),
    ];
  };
