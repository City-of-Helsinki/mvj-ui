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
import { getStorageItem } from "@/util/storage";
import { ACTIVE_SERVICE_UNIT_STORAGE_KEY } from "./constants";

// Storage can be unavailable (e.g. blocked cookies); a failed read means no saved preference.
const readStoredServiceUnitId = (): string => {
  try {
    return String(getStorageItem(ACTIVE_SERVICE_UNIT_STORAGE_KEY) ?? "");
  } catch {
    return "";
  }
};

function* fetchUsersPermissionsSaga(): Generator<any, any, any> {
  try {
    const {
      response: { status: statusCode },
      bodyAsJson,
    } = yield call(fetchUsersPermissions);

    switch (statusCode) {
      case 200: {
        const fallbackServiceUnit = bodyAsJson.service_units[0];
        yield put(receiveUserGroups(bodyAsJson.groups));
        yield put(receiveUserServiceUnits(bodyAsJson.service_units));
        yield put(receiveUsersPermissions(bodyAsJson.permissions));
        if (!fallbackServiceUnit) {
          yield put(
            receiveError(
              new Error(
                `Käyttäjälle ei ole asetettu palvelukokonaisuuksia. Kokeile päivittää sivu, ja ota yhteyttä tukeen, jotta puuttuvat käyttäjäryhmät voidaan asettaa.
        User has no service units assigned. Try to refresh the page and contact support to configure correct user groups.`,
              ),
            ),
          );
        } else {
          const storedId = readStoredServiceUnitId();
          const restored = bodyAsJson.service_units.find(
            (unit: { id: number }) => String(unit.id) === storedId,
          );
          yield put(setUserActiveServiceUnit(restored ?? fallbackServiceUnit));
        }
        break;
      }

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
      yield takeLatest(fetchUsersPermissionsAction, fetchUsersPermissionsSaga);
    }),
  ]);
}
