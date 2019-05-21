// @flow
import {expect} from 'chai';

import {
  fetchJobAttributes,
  notFoundJobAttributes,
  receiveJobAttributes,
  receiveJobMethods,
  fetchJobRunAttributes,
  notFoundJobRunAttributes,
  receiveJobRunAttributes,
  receiveJobRunMethods,
  fetchJobRunLogEntryAttributes,
  notFoundJobRunLogEntryAttributes,
  receiveJobRunLogEntryAttributes,
  receiveJobRunLogEntryMethods,
  fetchBatchRuns,
  notFoundBatchRuns,
  fetchBatchSchedules,
  notFoundBatchSchedules,
} from './actions';
import batchrunReducer from './reducer';

import type {BatchRunState} from './types';

const defaultState: BatchRunState = {
  isFetchingJobAttributes: false,
  isFetchingJobRunAttributes: false,
  isFetchingJobRunLogEntryAttributes: false,
  isFetchingRuns: false,
  isFetchingSchedules: false,
  jobAttributes: null,
  jobMethods: null,
  jobRunAttributes: null,
  jobRunMethods: null,
  jobRunLogEntryAttributes: null,
  jobRunLogEntryMethods: null,
};

// $FlowFixMe
describe('Infill development', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('infillDevelopmentReducer', () => {

      // $FlowFixMe
      it('should update isFetchingJobAttributes flag to true by fetchJobAttributes', () => {
        const newState = {...defaultState, isFetchingJobAttributes: true};

        const state = batchrunReducer({}, fetchJobAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingJobAttributes flag to false by notFoundJobAttributes', () => {
        const newState = {...defaultState, isFetchingJobAttributes: false};

        let state: Object = batchrunReducer({}, fetchJobAttributes());
        state = batchrunReducer(state, notFoundJobAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update jobAttributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobAttributes: dummyAttributes};

        const state = batchrunReducer({}, receiveJobAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update jobMethods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, jobMethods: dummyMethods};

        const state = batchrunReducer({}, receiveJobMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

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
