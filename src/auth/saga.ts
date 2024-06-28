import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { tokenNotFound, receiveApiToken } from "./actions";
import { getEpochTime } from "/src/util/helpers";
import userManager from "../auth/util/user-manager";

function* fetchApiTokenSaga({
  payload: token,
  type: any
}): Generator<any, any, any> {
  try {
    const request = new Request(process.env.OPENID_CONNECT_API_TOKEN_URL || 'https://api.hel.fi/sso/api-tokens/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const response = yield call(fetch, request);
    const {
      status: statusCode
    } = response;

    switch (statusCode) {
      case 200:
        {
          const bodyAsJson = yield call([response, response.json]);
          // Add expires_at time to fetch new api token after 9 minutes
          bodyAsJson.expires_at = getEpochTime() + 9 * 60;
          yield put(receiveApiToken(bodyAsJson));
          break;
        }

      default:
        {
          yield put(tokenNotFound());
          userManager.removeUser();
          break;
        }
    }
  } catch (error) {
    console.error(`Failed to fetch API token with error: ${error}`);
    yield put(tokenNotFound());
    userManager.removeUser();
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/auth/FETCH_API_TOKEN', fetchApiTokenSaga);
  })]);
}