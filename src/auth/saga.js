// @flow

import {takeLatest} from 'redux-saga';
import {fork, put} from 'redux-saga/effects';

import {receiveApiToken} from './actions';

function* fetchApiTokenSaga({payload: token}): Generator<> {
  try {
    const response = yield fetch('https://api.hel.fi/sso/api-tokens/',
      {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`},
      }
    );
    //TODO: Add error handling
    switch (response.status) {
      case 200: {
        const data = yield response.json();
        yield put(receiveApiToken(data));
        break;
      }
      default: {
        console.log('Failed to fetch token');
        break;
      }
    }
  } catch (error) {
    console.error('Failed to fetch token "%s"', error);
  }
}


export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/auth/FETCH_API_TOKEN', fetchApiTokenSaga);
    }),
  ];
}
