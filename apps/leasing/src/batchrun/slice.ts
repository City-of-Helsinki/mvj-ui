import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods, QueryParams } from "@/types";
import type { BatchRunState, JobRuns, ScheduledJobs } from "./types";

export const initialState: BatchRunState = {
  isFetchingJobRunAttributes: false,
  isFetchingJobRuns: false,
  isFetchingJobRunLogEntryAttributes: false,
  isFetchingJobRunLogEntriesByRun: {},
  isFetchingScheduledJobAttributes: false,
  isFetchingScheduledJobs: false,
  jobRunAttributes: null,
  jobRunMethods: null,
  jobRuns: null,
  jobRunLogEntryAttributes: null,
  jobRunLogEntryMethods: null,
  jobRunLogEntriesByRun: {},
  scheduledJobAttributes: null,
  scheduledJobMethods: null,
  scheduledJobs: null,
};

const batchRunSlice = createSlice({
  name: "mvj/batchrun",
  initialState,
  reducers: {
    fetchJobRunAttributes: (state) => {
      state.isFetchingJobRunAttributes = true;
    },
    receiveJobRunAttributes: (
      state,
      { payload }: PayloadAction<Attributes>,
    ) => {
      state.jobRunAttributes = payload;
    },
    receiveJobRunMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.jobRunMethods = payload;
      state.isFetchingJobRunAttributes = false;
    },
    notFoundJobRunAttributes: (state) => {
      state.isFetchingJobRunAttributes = false;
    },
    fetchJobRunLogEntryAttributes: (state) => {
      state.isFetchingJobRunLogEntryAttributes = true;
    },
    receiveJobRunLogEntryAttributes: (
      state,
      { payload }: PayloadAction<Attributes>,
    ) => {
      state.jobRunLogEntryAttributes = payload;
    },
    receiveJobRunLogEntryMethods: (
      state,
      { payload }: PayloadAction<Methods>,
    ) => {
      state.jobRunLogEntryMethods = payload;
      state.isFetchingJobRunLogEntryAttributes = false;
    },
    notFoundJobRunLogEntryAttributes: (state) => {
      state.isFetchingJobRunLogEntryAttributes = false;
    },
    fetchScheduledJobAttributes: (state) => {
      state.isFetchingScheduledJobAttributes = true;
    },
    receiveScheduledJobAttributes: (
      state,
      { payload }: PayloadAction<Attributes>,
    ) => {
      state.scheduledJobAttributes = payload;
    },
    receiveScheduledJobMethods: (
      state,
      { payload }: PayloadAction<Methods>,
    ) => {
      state.scheduledJobMethods = payload;
      state.isFetchingScheduledJobAttributes = false;
    },
    notFoundScheduledJobAttributes: (state) => {
      state.isFetchingScheduledJobAttributes = false;
    },
    fetchJobRuns: (state, _action: PayloadAction<QueryParams>) => {
      state.isFetchingJobRuns = true;
    },
    receiveJobRuns: (state, { payload }: PayloadAction<JobRuns>) => {
      state.jobRuns = payload;
      state.isFetchingJobRuns = false;
    },
    notFoundJobRuns: (state) => {
      state.isFetchingJobRuns = false;
    },
    fetchJobRunLogEntriesByRun: (state, { payload }: PayloadAction<number>) => {
      state.isFetchingJobRunLogEntriesByRun = {
        ...state.isFetchingJobRunLogEntriesByRun,
        [payload]: true,
      };
    },
    receiveJobRunLogEntriesByRun: (
      state,
      { payload }: PayloadAction<{ run: number; data: any }>,
    ) => {
      state.jobRunLogEntriesByRun = {
        ...state.jobRunLogEntriesByRun,
        [payload.run]: payload.data,
      };
      state.isFetchingJobRunLogEntriesByRun = {
        ...state.isFetchingJobRunLogEntriesByRun,
        [payload.run]: false,
      };
    },
    notFoundJobRunLogEntriesByRun: (
      state,
      { payload }: PayloadAction<number>,
    ) => {
      state.isFetchingJobRunLogEntriesByRun = {
        ...state.isFetchingJobRunLogEntriesByRun,
        [payload]: false,
      };
    },
    fetchScheduledJobs: (
      state,
      _action: PayloadAction<Record<string, any>>,
    ) => {
      state.isFetchingScheduledJobs = true;
    },
    receiveScheduledJobs: (
      state,
      { payload }: PayloadAction<ScheduledJobs>,
    ) => {
      state.scheduledJobs = payload;
      state.isFetchingScheduledJobs = false;
    },
    notFoundScheduledJobs: (state) => {
      state.isFetchingScheduledJobs = false;
    },
  },
});

export const {
  fetchJobRunAttributes,
  receiveJobRunAttributes,
  receiveJobRunMethods,
  notFoundJobRunAttributes,
  fetchJobRunLogEntryAttributes,
  receiveJobRunLogEntryAttributes,
  receiveJobRunLogEntryMethods,
  notFoundJobRunLogEntryAttributes,
  fetchScheduledJobAttributes,
  receiveScheduledJobAttributes,
  receiveScheduledJobMethods,
  notFoundScheduledJobAttributes,
  fetchJobRuns,
  receiveJobRuns,
  notFoundJobRuns,
  fetchJobRunLogEntriesByRun,
  receiveJobRunLogEntriesByRun,
  notFoundJobRunLogEntriesByRun,
  fetchScheduledJobs,
  receiveScheduledJobs,
  notFoundScheduledJobs,
} = batchRunSlice.actions;

export default batchRunSlice.reducer;
