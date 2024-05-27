import { expect } from "chai";
import { fetchJobRunAttributes, notFoundJobRunAttributes, receiveJobRunAttributes, receiveJobRunMethods, fetchJobRunLogEntryAttributes, notFoundJobRunLogEntryAttributes, receiveJobRunLogEntryAttributes, receiveJobRunLogEntryMethods, fetchScheduledJobAttributes, notFoundScheduledJobAttributes, receiveScheduledJobAttributes, receiveScheduledJobMethods, fetchJobRuns, receiveJobRuns, notFoundJobRuns, fetchJobRunLogEntriesByRun, receiveJobRunLogEntriesByRun, notFoundJobRunLogEntriesByRun, fetchScheduledJobs, receiveScheduledJobs, notFoundScheduledJobs } from "./actions";
import batchrunReducer from "./reducer";
import type { BatchRunState } from "./types";
const defaultState: BatchRunState = {
  isFetchingJobRunAttributes: false,
  isFetchingJobRuns: false,
  isFetchingJobRunLogEntryAttributes: false,
  isFetchingScheduledJobs: false,
  isFetchingScheduledJobAttributes: false,
  isFetchingJobRunLogEntriesByRun: {},
  jobRunAttributes: null,
  jobRunMethods: null,
  jobRuns: null,
  jobRunLogEntryAttributes: null,
  jobRunLogEntryMethods: null,
  jobRunLogEntriesByRun: {},
  scheduledJobAttributes: null,
  scheduledJobMethods: null,
  scheduledJobs: null
};

describe('Batchrun', () => {
  describe('Reducer', () => {
    describe('batchrunReducer', () => {
      it('should update isFetchingJobRunAttributes flag to true by fetchJobRunAttributes', () => {
        const newState = { ...defaultState,
          isFetchingJobRunAttributes: true
        };
        const state = batchrunReducer({}, fetchJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunAttributes flag to false by notFoundJobRunAttributes', () => {
        const newState = { ...defaultState,
          isFetchingJobRunAttributes: false
        };
        let state: Record<string, any> = batchrunReducer({}, fetchJobRunAttributes());
        state = batchrunReducer(state, notFoundJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update jobRunAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          jobRunAttributes: dummyAttributes
        };
        const state = batchrunReducer({}, receiveJobRunAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update jobRunMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          jobRunMethods: dummyMethods
        };
        const state = batchrunReducer({}, receiveJobRunMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunLogEntryAttributes flag to true by fetchJobRunLogEntryAttributes', () => {
        const newState = { ...defaultState,
          isFetchingJobRunLogEntryAttributes: true
        };
        const state = batchrunReducer({}, fetchJobRunLogEntryAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunLogEntryAttributes flag to false by notFoundJobRunLogEntryAttributes', () => {
        const newState = { ...defaultState,
          isFetchingJobRunLogEntryAttributes: false
        };
        let state: Record<string, any> = batchrunReducer({}, fetchJobRunLogEntryAttributes());
        state = batchrunReducer(state, notFoundJobRunLogEntryAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update jobRunLogEntryAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          jobRunLogEntryAttributes: dummyAttributes
        };
        const state = batchrunReducer({}, receiveJobRunLogEntryAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update jobRunLogEntryMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          jobRunLogEntryMethods: dummyMethods
        };
        const state = batchrunReducer({}, receiveJobRunLogEntryMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingScheduledJobAttributes flag to true by fetchScheduledJobAttributes', () => {
        const newState = { ...defaultState,
          isFetchingScheduledJobAttributes: true
        };
        const state = batchrunReducer({}, fetchScheduledJobAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingScheduledJobAttributes flag to false by notFoundScheduledJobAttributes', () => {
        const newState = { ...defaultState,
          isFetchingScheduledJobAttributes: false
        };
        let state: Record<string, any> = batchrunReducer({}, fetchScheduledJobAttributes());
        state = batchrunReducer(state, notFoundScheduledJobAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update scheduledJobAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          scheduledJobAttributes: dummyAttributes
        };
        const state = batchrunReducer({}, receiveScheduledJobAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update scheduledJobMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...defaultState,
          scheduledJobMethods: dummyMethods
        };
        const state = batchrunReducer({}, receiveScheduledJobMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRuns flag to true when fetching batch runs', () => {
        const newState = { ...defaultState,
          isFetchingJobRuns: true
        };
        const state = batchrunReducer({}, fetchJobRuns({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRuns flag to true by notFoundJobRuns', () => {
        const newState = { ...defaultState,
          isFetchingJobRuns: false
        };
        let state = batchrunReducer({}, fetchJobRuns({}));
        state = batchrunReducer(state, notFoundJobRuns());
        expect(state).to.deep.equal(newState);
      });
      it('should update jobRuns', () => {
        const dummyJobRuns = {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
        const newState = { ...defaultState,
          isFetchingJobRuns: false,
          jobRuns: dummyJobRuns
        };
        const state = batchrunReducer({}, receiveJobRuns(dummyJobRuns));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingScheduledJobs flag to true when fetching scheduled jobs', () => {
        const newState = { ...defaultState,
          isFetchingScheduledJobs: true
        };
        const state = batchrunReducer({}, fetchScheduledJobs({}));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingScheduledJobs flag to true by notFoundScheduledJobs', () => {
        const newState = { ...defaultState,
          isFetchingScheduledJobs: false
        };
        let state = batchrunReducer({}, fetchScheduledJobs({}));
        state = batchrunReducer(state, notFoundScheduledJobs());
        expect(state).to.deep.equal(newState);
      });
      it('should update scheduledJobs', () => {
        const dummyScheduledJobs = {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
        const newState = { ...defaultState,
          isFetchingScheduledJobs: false,
          scheduledJobs: dummyScheduledJobs
        };
        const state = batchrunReducer({}, receiveScheduledJobs(dummyScheduledJobs));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunLogEntriesByRun flag to true when fetching job run log entries', () => {
        const newState = { ...defaultState,
          isFetchingJobRunLogEntriesByRun: {
            '1': true
          }
        };
        const state = batchrunReducer({}, fetchJobRunLogEntriesByRun(1));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunLogEntriesByRun flag to false when received job run log entries', () => {
        const id = 1;
        const dummyPayload = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          isFetchingJobRunLogEntriesByRun: {
            [id]: false
          },
          jobRunLogEntriesByRun: {
            [id]: dummyPayload
          }
        };
        const state = batchrunReducer({}, receiveJobRunLogEntriesByRun({
          run: id,
          data: dummyPayload
        }));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingJobRunLogEntriesByRun flag to true by notFoundJobRunLogEntriesByRun', () => {
        const newState = { ...defaultState,
          isFetchingJobRunLogEntriesByRun: {
            '1': false
          }
        };
        let state = batchrunReducer({}, fetchJobRunLogEntriesByRun(1));
        state = batchrunReducer(state, notFoundJobRunLogEntriesByRun(1));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});