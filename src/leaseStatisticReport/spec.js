// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
} from './actions';
import leaseStatisticReport from './reducer';

import type {LeaseStatisticReportState} from './types';

const defaultState: LeaseStatisticReportState = {
  attributes: null,
  isFetchingAttributes: false,
};

// $FlowFixMe
describe('Create collection letter', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('leaseStatisticReport', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = leaseStatisticReport({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state: Object = leaseStatisticReport({}, fetchAttributes());
        state = leaseStatisticReport(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = leaseStatisticReport({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
