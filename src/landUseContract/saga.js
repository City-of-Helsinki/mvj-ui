// @flow
import {all, fork, put, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';

import {
  hideEditMode,
  receiveLandUseContractAttributes,
  receiveLandUseContractList,
  receiveSingleLandUseContract,
} from './actions';
import {displayUIMessage} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
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

function* createLandUseContractSaga({payload: landUseContract}): Generator<any, any, any> {
  console.log(landUseContract);
  yield put(push(`${getRouteById(Routes.LAND_USE_CONTRACTS)}/1`));
  displayUIMessage({title: '', body: 'Maankäyttösopimus luotu'});
}

function* editLandUseContractSaga({payload: landUseContract}): Generator<any, any, any> {
  yield put(receiveSingleLandUseContract(landUseContract));
  yield put(hideEditMode());
  displayUIMessage({title: '', body: 'Maankäyttösopimus tallennettu'});
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/landUseContract/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/landUseContract/FETCH_ALL', fetchLandUseContractsSaga);
      yield takeLatest('mvj/landUseContract/FETCH_SINGLE', fetchSingleLandUseContractSaga);
      yield takeLatest('mvj/landUseContract/CREATE', createLandUseContractSaga);
      yield takeLatest('mvj/landUseContract/EDIT', editLandUseContractSaga);
    }),
  ]);
}
