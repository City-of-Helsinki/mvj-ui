// @flow
import {expect} from 'chai';

import {
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
  fetchBatchRuns,
  notFoundBatchRuns,
  fetchBatchSchedules,
  notFoundBatchSchedules,
} from './actions';
import batchrunReducer from './reducer';

import type {BatchRunState} from './types';

const defaultState: BatchRunState = {
  isFetchingJobRunAttributes: false,
  isFetchingJobRunLogEntryAttributes: false,
  isFetchingRuns: false,
  isFetchingSchedules: false,
  isFetchingScheduledJobAttributes: false,
  jobRunAttributes: null,
  jobRunMethods: null,
  jobRunLogEntryAttributes: null,
  jobRunLogEntryMethods: null,
  scheduledJobAttributes: null,
  scheduledJobMethods: null,
};

// $FlowFixMe
describe('Infill development', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('infillDevelopmentReducer', () => {

      // $FlowFixMe
      it('should update isFetchingJobRunAttributes flag to true by fetchJobRunAttributes', () => {
        const newState = {...defaultState, isFetchingJobRunAttributes: true};

        const state = batchrunReducer({}, fetchJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingJobRunAttributes flag to false by notFoundJobRunAttributes', () => {
        const newState = {...defaultState, isFetchingJobRunAttributes: false};

        let state: Object = batchrunReducer({}, fetchJobRunAttributes());
        state = batchrunReducer(state, notFoundJobRunAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update jobRunAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobRunAttributes: dummyAttributes};

        const state = batchrunReducer({}, receiveJobRunAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update jobRunMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobRunMethods: dummyMethods};

        const state = batchrunReducer({}, receiveJobRunMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingJobRunLogEntryAttributes flag to true by fetchJobRunLogEntryAttributes', () => {
        const newState = {...defaultState, isFetchingJobRunLogEntryAttributes: true};

        const state = batchrunReducer({}, fetchJobRunLogEntryAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingJobRunLogEntryAttributes flag to false by notFoundJobRunLogEntryAttributes', () => {
        const newState = {...defaultState, isFetchingJobRunLogEntryAttributes: false};

        let state: Object = batchrunReducer({}, fetchJobRunLogEntryAttributes());
        state = batchrunReducer(state, notFoundJobRunLogEntryAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update jobRunLogEntryAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobRunLogEntryAttributes: dummyAttributes};

        const state = batchrunReducer({}, receiveJobRunLogEntryAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update jobRunLogEntryMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobRunLogEntryMethods: dummyMethods};

        const state = batchrunReducer({}, receiveJobRunLogEntryMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingScheduledJobAttributes flag to true by fetchScheduledJobAttributes', () => {
        const newState = {...defaultState, isFetchingScheduledJobAttributes: true};

        const state = batchrunReducer({}, fetchScheduledJobAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingScheduledJobAttributes flag to false by notFoundScheduledJobAttributes', () => {
        const newState = {...defaultState, isFetchingJobAttributes: false};

        let state: Object = batchrunReducer({}, fetchScheduledJobAttributes());
        state = batchrunReducer(state, notFoundScheduledJobAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update scheduledJobAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, scheduledJobAttributes: dummyAttributes};

        const state = batchrunReducer({}, receiveScheduledJobAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update scheduledJobMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, scheduledJobMethods: dummyMethods};

        const state = batchrunReducer({}, receiveScheduledJobMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingRuns flag to true when fetching batch runs', () => {
        const newState = {...defaultState, isFetchingRuns: true};

        const state = batchrunReducer({}, fetchBatchRuns({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingRuns flag to true by notFoundBatchRuns', () => {
        const newState = {...defaultState, isFetchingRuns: false};

        let state = batchrunReducer({}, fetchBatchRuns({}));
        state = batchrunReducer(state, notFoundBatchRuns());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingSchedules flag to true when fetching batch schedules', () => {
        const newState = {...defaultState, isFetchingSchedules: true};

        const state = batchrunReducer({}, fetchBatchSchedules({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingSchedules flag to true by notFoundBatchSchedules', () => {
        const newState = {...defaultState, isFetchingSchedules: false};

        let state = batchrunReducer({}, fetchBatchSchedules({}));
        state = batchrunReducer(state, notFoundBatchSchedules());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
