// @flow
import {all, call, fork, put, takeLatest} from 'redux-saga/effects';

import {receiveError} from '$src/api/actions';
import {
  receiveTradeRegisterCompanyExtendedById,
  companyExtendedNotFoundById,
} from './actions';
import {
  fetchCompanyExtended,
} from './requests';

function* fetchCompanyExtendedByIdSaga({payload: businessId}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCompanyExtended, businessId);

    switch (statusCode) {
      case 200:
        yield put(receiveTradeRegisterCompanyExtendedById({[businessId.toString()]: bodyAsJson.companyExtendedInfoResponseDetails}));
        break;
      default:
        console.error('Failed to fetch company extended info');
        yield put(companyExtendedNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch company extended info with error "%s"', error);
    yield put(companyExtendedNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID', fetchCompanyExtendedByIdSaga);
    }),
  ]);
}
