// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';

import {
  receiveLandUseContractAttributes,
  receiveLandUseContractList,
  receiveSingleLandUseContract,
} from './actions';
import attributesMockData from './attributes-mock-data.json';
import mockData from './mock-data.json';

function* fetchAttributesSaga(): Generator<any, any, any> {
  const attributes = attributesMockData.fields;
  yield put(receiveLandUseContractAttributes(attributes));
}

function* fetchLandUseContractsSaga({payload: search}): Generator<any, any, any> {
  console.log(search);
  const bodyAsJson = {
    count: 1,
    results: mockData,
  };
  yield put(receiveLandUseContractList(bodyAsJson));
}

function* fetchSingleLandUseContractSaga({payload: contractId}): Generator<any, any, any> {
  console.log(contractId);
  const bodyAsJson = mockData[0];
  yield put(receiveSingleLandUseContract(bodyAsJson));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/landUseContract/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/landUseContract/FETCH_ALL', fetchLandUseContractsSaga);
      yield takeLatest('mvj/landUseContract/FETCH_SINGLE', fetchSingleLandUseContractSaga);
    }),
  ]);
}
