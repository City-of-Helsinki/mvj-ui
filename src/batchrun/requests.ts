import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
export const fetchJobRunAttributes = () => {
  return callApi(new Request(createUrl('job_run/'), {
    method: 'OPTIONS'
  }));
};
export const fetchJobRuns = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('job_run/', params)));
};
export const fetchJobRunLogEntryAttributes = () => {
  return callApi(new Request(createUrl('job_run_log_entry/'), {
    method: 'OPTIONS'
  }));
};
export const fetchJobRunLogEntries = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('job_run_log_entry/', params)));
};
export const fetchScheduledJobAttributes = () => {
  return callApi(new Request(createUrl('scheduled_job/'), {
    method: 'OPTIONS'
  }));
};
export const fetchScheduledJobs = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('scheduled_job/', params)));
};