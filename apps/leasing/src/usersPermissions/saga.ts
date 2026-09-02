import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import {
  fetchUsersPermissions as fetchUsersPermissionsAction,
  receiveUserGroups,
  receiveUsersPermissions,
  receiveUserServiceUnits,
  setUserActiveServiceUnit,
  notFound,
} from "./slice";
import { fetchUsersPermissions } from "./requests";
import { receiveError } from "@/api/slice";

function* fetchUsersPermissionsSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchUsersPermissions);

    switch (statusCode) {
      case 200:
        yield put(receiveUserGroups(bodyAsJson.groups));
        yield put(receiveUserServiceUnits(bodyAsJson.service_units));
        yield put(receiveUsersPermissions(bodyAsJson.permissions));
        if (!bodyAsJson.service_units[0]) {
          yield put(
            receiveError(
              new Error(
                `Käyttäjälle ei ole asetettu palvelukokonaisuuksia. Kokeile päivittää sivu, ja ota yhteyttä tukeen, jotta puuttuvat käyttäjäryhmät voidaan asettaa.
        User has no service units assigned. Try to refresh the page and contact support to configure correct user groups.`,
              ),
            ),
          );
        } else {
          yield put(setUserActiveServiceUnit(bodyAsJson.service_units[0]));
        }
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
  yield all([
    fork(function* (): Generator<any, any, any> {
      yield takeLatest(
        fetchUsersPermissionsAction.type,
        fetchUsersPermissionsSaga,
      );
    }),
  ]);
}
