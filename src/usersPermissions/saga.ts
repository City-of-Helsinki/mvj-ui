import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveUserGroups, receiveUsersPermissions, receiveUserServiceUnits, setUserActiveServiceUnit, notFound } from "./actions";
import { fetchUsersPermissions } from "./requests";
import { receiveError } from "../api/actions";

function* fetchUsersPermissionsSaga(): Generator<any, any, any> {
  try {
    let {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchUsersPermissions);

    switch (statusCode) {
      case 200:
        yield put(receiveUserGroups(bodyAsJson.groups));
        yield put(receiveUserServiceUnits(bodyAsJson.service_units));
        yield put(receiveUsersPermissions(bodyAsJson.permissions));
        yield put(setUserActiveServiceUnit(bodyAsJson.service_units[0]));
        break;

      default:
        yield put(receiveError(bodyAsJson));
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch users permissions with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/usersPermissions/FETCH_ALL', fetchUsersPermissionsSaga);
  })]);
}