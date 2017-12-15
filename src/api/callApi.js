// @flow

// import {call, put, select} from 'redux-saga/effects';
import {call, put} from 'redux-saga/effects';
import {receiveError} from './actions';

// export const getApiToken = (state: any) => state.auth.apiToken['https://api.hel.fi/auth/mvj'];

function* callApi(request: Request): Generator<> {
  // TODO: Inject api token to all requests when authentication is implemented to the API
  // const apiToken = yield select(getApiToken);
  // if (apiToken) {
  //   request.headers.set('Authorization', `Token ${apiToken}`);
  // }

  if (request.method === 'POST' || request.method === 'PUT') {
    request.headers.set('Content-Type', 'application/json');
  }

  const response = yield call(fetch, request);
  const bodyAsJson = yield call([response, response.json]);

  if (status === 500) {
    yield put(receiveError(bodyAsJson));
  }

  return {response, bodyAsJson};
}

export default callApi;
