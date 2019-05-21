// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  notFound,
  receiveIndexList,
} from './actions';
import {
  fetchIndexList,
} from './requests';

function* fetchIndexListSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchIndexList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveIndexList(bodyAsJson.results));
        break;
      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch index list with error "%s"', error);
    yield put(notFound());
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/index/FETCH_ALL', fetchIndexListSaga);
    }),
  ]);
}
