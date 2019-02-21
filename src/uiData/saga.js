// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {receiveError} from '$src/api/actions';

import {
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  receiveUiDataList,
  notFound,
} from './actions';
import {
  fetchAttributes,
  fetchUiDataList,
} from './requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);

    switch (statusCode) {
      case 200:
        const attributes = bodyAsJson.attributes;
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch ui data attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchUiDataListSaga(query: Object): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchUiDataList, query);

    switch (statusCode) {
      case 200:
        yield put(receiveUiDataList(bodyAsJson.results));
        break;
      default:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch ui data list with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/uiData/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/uiData/FETCH_ALL', fetchUiDataListSaga);
    }),
  ]);
}
