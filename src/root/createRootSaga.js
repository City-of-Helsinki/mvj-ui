// @flow

import {fork} from 'redux-saga/effects';
import authSaga from '../auth/saga';
import invoiceSaga from '../leases/components/leaseSections/invoice/saga';
import contactSaga from '../contacts/saga';
import leaseSaga from '../leases/saga';
import rentBasisSaga from '../rentbasis/saga';
import userSaga from '../users/saga';

export default () =>
  // $FlowFixMe
  function* rootSaga() {
    yield [
      fork(authSaga),
      fork(invoiceSaga),
      fork(contactSaga),
      fork(leaseSaga),
      fork(rentBasisSaga),
      fork(userSaga),
    ];
  };
