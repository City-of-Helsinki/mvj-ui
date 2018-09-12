// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveCollectionLetterTemplates,
  notFound,
} from './actions';
import {receiveError} from '$src/api/actions';
import {getSearchQuery} from '$util/helpers';
import {
  fetchCollectionLetterTemplates,
} from './requests';


function* fetchCollectionLetterTemplatesSaga(): Generator<any, any, any> {
  try {
    // TODO: This should be enough because there are less than 10 collection letter templates. Loop through all pages if needed at some point
    const search = getSearchQuery({limit: 10000});
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCollectionLetterTemplates, search);
    switch (statusCode) {
      case 200:
        yield put(receiveCollectionLetterTemplates(bodyAsJson.results));
        break;
      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection letter templates with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/collectionLetterTemplate/FETCH_ALL', fetchCollectionLetterTemplatesSaga);
    }),
  ]);
}
