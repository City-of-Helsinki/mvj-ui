import { describe, expect, it } from "vitest";
import batchrunReducer, {
  initialState,
  fetchJobRunAttributes,
  notFoundJobRunAttributes,
  receiveJobRunAttributes,
  receiveJobRunMethods,
  fetchJobRunLogEntryAttributes,
  notFoundJobRunLogEntryAttributes,
  receiveJobRunLogEntryAttributes,
  receiveJobRunLogEntryMethods,
  fetchScheduledJobAttributes,
  notFoundScheduledJobAttributes,
  receiveScheduledJobAttributes,
  receiveScheduledJobMethods,
  fetchJobRuns,
  receiveJobRuns,
  notFoundJobRuns,
  fetchJobRunLogEntriesByRun,
  receiveJobRunLogEntriesByRun,
  notFoundJobRunLogEntriesByRun,
  fetchScheduledJobs,
  receiveScheduledJobs,
  notFoundScheduledJobs,
} from "./slice";

describe("Batchrun", () => {
  describe("Reducer", () => {
    describe("batchrunReducer", () => {
      it("should update isFetchingJobRunAttributes flag to true by fetchJobRunAttributes", () => {
        const newState = { ...initialState, isFetchingJobRunAttributes: true };
        const state = batchrunReducer(initialState, fetchJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunAttributes flag to false by notFoundJobRunAttributes", () => {
        const newState = { ...initialState, isFetchingJobRunAttributes: false };
        let state = batchrunReducer(initialState, fetchJobRunAttributes());
        state = batchrunReducer(state, notFoundJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update jobRunAttributes", () => {
        const dummyAttributes = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...initialState, jobRunAttributes: dummyAttributes };
        const state = batchrunReducer(
          initialState,
          receiveJobRunAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update jobRunMethods", () => {
        const dummyMethods = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...initialState, jobRunMethods: dummyMethods };
        const state = batchrunReducer(
          initialState,
          receiveJobRunMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunLogEntryAttributes flag to true by fetchJobRunLogEntryAttributes", () => {
        const newState = {
          ...initialState,
          isFetchingJobRunLogEntryAttributes: true,
        };
        const state = batchrunReducer(
          initialState,
          fetchJobRunLogEntryAttributes(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunLogEntryAttributes flag to false by notFoundJobRunLogEntryAttributes", () => {
        const newState = {
          ...initialState,
          isFetchingJobRunLogEntryAttributes: false,
        };
        let state = batchrunReducer(
          initialState,
          fetchJobRunLogEntryAttributes(),
        );
        state = batchrunReducer(state, notFoundJobRunLogEntryAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update jobRunLogEntryAttributes", () => {
        const dummyAttributes = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = {
          ...initialState,
          jobRunLogEntryAttributes: dummyAttributes,
        };
        const state = batchrunReducer(
          initialState,
          receiveJobRunLogEntryAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update jobRunLogEntryMethods", () => {
        const dummyMethods = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = {
          ...initialState,
          jobRunLogEntryMethods: dummyMethods,
        };
        const state = batchrunReducer(
          initialState,
          receiveJobRunLogEntryMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingScheduledJobAttributes flag to true by fetchScheduledJobAttributes", () => {
        const newState = {
          ...initialState,
          isFetchingScheduledJobAttributes: true,
        };
        const state = batchrunReducer(
          initialState,
          fetchScheduledJobAttributes(),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingScheduledJobAttributes flag to false by notFoundScheduledJobAttributes", () => {
        const newState = {
          ...initialState,
          isFetchingScheduledJobAttributes: false,
        };
        let state = batchrunReducer(
          initialState,
          fetchScheduledJobAttributes(),
        );
        state = batchrunReducer(state, notFoundScheduledJobAttributes());
        expect(state).to.deep.equal(newState);
      });
      it("should update scheduledJobAttributes", () => {
        const dummyAttributes = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = {
          ...initialState,
          scheduledJobAttributes: dummyAttributes,
        };
        const state = batchrunReducer(
          initialState,
          receiveScheduledJobAttributes(dummyAttributes),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update scheduledJobMethods", () => {
        const dummyMethods = {
          id: 1,
          label: "Foo",
          name: "Bar",
        };
        const newState = { ...initialState, scheduledJobMethods: dummyMethods };
        const state = batchrunReducer(
          initialState,
          receiveScheduledJobMethods(dummyMethods),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRuns flag to true when fetching batch runs", () => {
        const newState = { ...initialState, isFetchingJobRuns: true };
        const state = batchrunReducer(initialState, fetchJobRuns({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRuns flag to true by notFoundJobRuns", () => {
        const newState = { ...initialState, isFetchingJobRuns: false };
        let state = batchrunReducer(initialState, fetchJobRuns({}));
        state = batchrunReducer(state, notFoundJobRuns());
        expect(state).to.deep.equal(newState);
      });
      it("should update jobRuns", () => {
        const dummyJobRuns = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {
          ...initialState,
          isFetchingJobRuns: false,
          jobRuns: dummyJobRuns,
        };
        const state = batchrunReducer(
          initialState,
          receiveJobRuns(dummyJobRuns),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingScheduledJobs flag to true when fetching scheduled jobs", () => {
        const newState = { ...initialState, isFetchingScheduledJobs: true };
        const state = batchrunReducer(initialState, fetchScheduledJobs({}));
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingScheduledJobs flag to true by notFoundScheduledJobs", () => {
        const newState = { ...initialState, isFetchingScheduledJobs: false };
        let state = batchrunReducer(initialState, fetchScheduledJobs({}));
        state = batchrunReducer(state, notFoundScheduledJobs());
        expect(state).to.deep.equal(newState);
      });
      it("should update scheduledJobs", () => {
        const dummyScheduledJobs = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };
        const newState = {
          ...initialState,
          isFetchingScheduledJobs: false,
          scheduledJobs: dummyScheduledJobs,
        };
        const state = batchrunReducer(
          initialState,
          receiveScheduledJobs(dummyScheduledJobs),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunLogEntriesByRun flag to true when fetching job run log entries", () => {
        const newState = {
          ...initialState,
          isFetchingJobRunLogEntriesByRun: {
            "1": true,
          },
        };
        const state = batchrunReducer(
          initialState,
          fetchJobRunLogEntriesByRun(1),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunLogEntriesByRun flag to false when received job run log entries", () => {
        const id = 1;
        const dummyPayload = {
          foo: "bar",
        };
        const newState = {
          ...initialState,
          isFetchingJobRunLogEntriesByRun: {
            [id]: false,
          },
          jobRunLogEntriesByRun: {
            [id]: dummyPayload,
          },
        };
        const state = batchrunReducer(
          initialState,
          receiveJobRunLogEntriesByRun({
            run: id,
            data: dummyPayload,
          }),
        );
        expect(state).to.deep.equal(newState);
      });
      it("should update isFetchingJobRunLogEntriesByRun flag to true by notFoundJobRunLogEntriesByRun", () => {
        const newState = {
          ...initialState,
          isFetchingJobRunLogEntriesByRun: {
            "1": false,
          },
        };
        let state = batchrunReducer(
          initialState,
          fetchJobRunLogEntriesByRun(1),
        );
        state = batchrunReducer(state, notFoundJobRunLogEntriesByRun(1));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
