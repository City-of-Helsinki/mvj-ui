// @flow
import {all, call, fork, put, select, takeEvery, takeLatest} from 'redux-saga/effects';

import {applicantInfoCheckAttributesNotFound, receiveApplicantInfoCheckAttributes} from '$src/application/actions';
import {receiveError} from '$src/api/actions';
import {fetchApplicantInfoCheckAttributesRequest} from '$src/application/requests';
import type {ReceiveUpdatedTargetInfoCheckItemAction} from '$src/plotApplications/types';
import {getApplicantInfoCheckFormName} from '$src/application/helpers';
import {getFormValues, initialize} from 'redux-form';
import {getContentUser} from '$src/users/helpers';

function* fetchApplicantInfoCheckAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchApplicantInfoCheckAttributesRequest);

    switch(statusCode) {
      case 200:
        const attributes = {
          ...bodyAsJson.fields,
        };

        yield put(receiveApplicantInfoCheckAttributes(attributes));
        break;
      default:
        yield put(applicantInfoCheckAttributesNotFound());
    }
  } catch (error) {
    console.error('Failed to fetch info check attributes with error "%s"', error);
    yield put(applicantInfoCheckAttributesNotFound());
    yield put(receiveError(error));
  }
}

function* receiveUpdatedApplicantInfoCheckItemSaga({payload}: ReceiveUpdatedTargetInfoCheckItemAction): Generator<any, any, any> {
  const formName = getApplicantInfoCheckFormName(payload.id);

  const oldValues = yield select(getFormValues(formName));
  yield put(initialize(formName, {
    ...oldValues,
    data: {
      ...payload.data,
      preparer: getContentUser(payload.data.preparer),
    },
  }));
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES', fetchApplicantInfoCheckAttributesSaga);
      yield takeEvery('mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM', receiveUpdatedApplicantInfoCheckItemSaga);
    }),
  ]);
}
