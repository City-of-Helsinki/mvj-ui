// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveUsers, notFound} from './actions';
import {fetchUsers} from './requests';
import {receiveError} from '../api/actions';

function* fetchUsersSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchUsers);

    switch (statusCode) {
      case 200:
        const users = bodyAsJson.map((user): Object => ({
          ...user,
          label: `${user.first_name} ${user.last_name}`,
        }));

        yield put(receiveUsers(users));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch users with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/user/FETCH', fetchUsersSaga);
    }),
  ]);
}
