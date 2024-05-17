import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { receiveError } from "src/api/actions";
import { receiveTradeRegisterCompanyExtendedById, companyExtendedNotFoundById, receiveTradeRegisterCompanyNoticeById, companyNoticeNotFoundById, receiveTradeRegisterCompanyRepresentById, companyRepresentNotFoundById } from "./actions";
import { fetchCompanyExtended, fetchCompanyNotice, fetchCompanyRepresent } from "./requests";

function* fetchCompanyExtendedByIdSaga({
  payload: businessId
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCompanyExtended, businessId);

    switch (statusCode) {
      case 200:
        yield put(receiveTradeRegisterCompanyExtendedById({
          [businessId.toString()]: bodyAsJson.companyExtendedInfoResponseDetails
        }));
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

function* fetchCompanyNoticeByIdSaga({
  payload: businessId
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCompanyNotice, businessId);

    switch (statusCode) {
      case 200:
        yield put(receiveTradeRegisterCompanyNoticeById({
          [businessId.toString()]: bodyAsJson.companyNoticeInfoResponseTypeDetails
        }));
        break;

      default:
        console.error('Failed to fetch company notice info');
        yield put(companyNoticeNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch company notice info with error "%s"', error);
    yield put(companyNoticeNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

function* fetchCompanyRepresentByIdSaga({
  payload: businessId
}): Generator<any, any, any> {
  try {
    const {
      response: {
        status: statusCode
      },
      bodyAsJson
    } = yield call(fetchCompanyRepresent, businessId);

    switch (statusCode) {
      case 200:
        yield put(receiveTradeRegisterCompanyRepresentById({
          [businessId.toString()]: bodyAsJson.companyRepresentInfoResponseTypeDetails
        }));
        break;

      default:
        console.error('Failed to fetch company represent info');
        yield put(companyRepresentNotFoundById(businessId));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch company represent info with error "%s"', error);
    yield put(companyRepresentNotFoundById(businessId));
    yield put(receiveError(error));
  }
}

export default function* (): Generator<any, any, any> {
  yield all([fork(function* (): Generator<any, any, any> {
    yield takeLatest('mvj/tradeRegister/FETCH_COMPANY_EXTENDED_BY_ID', fetchCompanyExtendedByIdSaga);
    yield takeLatest('mvj/tradeRegister/FETCH_COMPANY_NOTICE_BY_ID', fetchCompanyNoticeByIdSaga);
    yield takeLatest('mvj/tradeRegister/FETCH_COMPANY_REPRESENT_BY_ID', fetchCompanyRepresentByIdSaga);
  })]);
}