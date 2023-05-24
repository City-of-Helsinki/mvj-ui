//@flow

// $FlowFixMe
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import {
  receiveError,
} from '$src/api/actions';
import {
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  receiveAreaSearchList,
  areaSearchesNotFound,
  areaSearchesByBBoxNotFound,
  receiveAreaSearchByBBoxList,
} from '$src/areaSearch/actions';
import {fetchAreaSearchAttributesRequest, fetchAreaSearchesRequest} from '$src/areaSearch/requests';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchAttributesRequest);

    switch (statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };
        const methods = bodyAsJson.methods;

        yield put(receiveAttributes(attributes));
        yield put(receiveMethods(methods));
        break;
      default:
        yield put(attributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch attributes with error "%s"', error);
    yield put(attributesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchAreaSearchListSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchesRequest, query);

    switch(statusCode) {
      case 200:
        yield put(receiveAreaSearchList(bodyAsJson));
        break;
      default:
        yield put(areaSearchesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch area searches with error "%s"', error);
    yield put(areaSearchesNotFound());
    yield put(receiveError(error));
  }
}

function* fetchAreaSearchesByBBoxSaga({payload: query}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAreaSearchesRequest, query);

    switch (statusCode) {
      case 200:
        yield put(receiveAreaSearchByBBoxList(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(areaSearchesByBBoxNotFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(areaSearchesByBBoxNotFound());
    yield put(receiveError(error));
  }
}


export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/areaSearch/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/areaSearch/FETCH_ALL', fetchAreaSearchListSaga);
      yield takeLatest('mvj/areaSearch/FETCH_ALL_BY_BBOX', fetchAreaSearchesByBBoxSaga);
    }),
  ]);
}
