// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

export const fetchJobAttributes = () => {
  return callApi(new Request(createUrl('batchrun/job/'), {method: 'OPTIONS'}));
};

export const fetchJobRunAttributes = () => {
  return callApi(new Request(createUrl('batchrun/job_run/'), {method: 'OPTIONS'}));
};

export const fetchJobRunLogEntryAttributes = () => {
  return callApi(new Request(createUrl('batchrun/job_run_log_entry/'), {method: 'OPTIONS'}));
};
