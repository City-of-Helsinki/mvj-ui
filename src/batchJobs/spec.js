// @flow
import {expect} from 'chai';

import {
  fetchBatchRuns,
  notFoundBatchRuns,
  fetchBatchSchedules,
  notFoundBatchSchedules,
} from './actions';
import batchJobsReducer from './reducer';

import type {BatchJobsState} from './types';

const defaultState: BatchJobsState = {
  isFetchingRuns: false,
  isFetchingSchedules: false,
};

// $FlowFixMe
describe('Infill development', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('infillDevelopmentReducer', () => {

      // $FlowFixMe
      it('should update isFetchingRuns flag to true when fetching batch runs', () => {
        const newState = {...defaultState, isFetchingRuns: true};

        const state = batchJobsReducer({}, fetchBatchRuns({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingRuns flag to true by notFoundBatchRuns', () => {
        const newState = {...defaultState, isFetchingRuns: false};

        let state = batchJobsReducer({}, fetchBatchRuns({}));
        state = batchJobsReducer(state, notFoundBatchRuns());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingSchedules flag to true when fetching batch schedules', () => {
        const newState = {...defaultState, isFetchingSchedules: true};

        const state = batchJobsReducer({}, fetchBatchSchedules({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingSchedules flag to true by notFoundBatchSchedules', () => {
        const newState = {...defaultState, isFetchingSchedules: false};

        let state = batchJobsReducer({}, fetchBatchSchedules({}));
        state = batchJobsReducer(state, notFoundBatchSchedules());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
