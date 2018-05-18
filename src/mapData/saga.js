// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {stringifyQuery} from '$src/api/createUrl';
import {
  notFound,
  receiveMapDataByType,
} from './actions';
import {fetchMapData} from './requests';
import {receiveError} from '../api/actions';

function* fetchMapdataByTypeSaga({payload: type}): Generator<any, any, any> {
  try {
    const query = {
      version: '1.1.0',
      request: 'GetFeature',
      outputformat: 'application/json',
      typeName: type,
    };
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchMapData, stringifyQuery(query));

    switch (statusCode) {
      case 200:
        yield put(receiveMapDataByType({type: type, data: bodyAsJson}));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch map data by type with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/mapdata/FETCH_BY_TYPE', fetchMapdataByTypeSaga);
    }),
  ]);
}
