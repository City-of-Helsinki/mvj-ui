// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  fetchLeaseInvoicingConfirmationReportAttributes,
  leaseInvoicingConfirmationReportAttributesNotFound,
  receiveLeaseInvoicingConfirmationReportAttributes,
  fetchLeaseInvoicingConfrimationReports,
  notFoundLeaseInvoicingConfrimationReports,
  receiveLeaseInvoicingConfrimationReports,
} from './actions';
import leaseStatisticReport from './reducer';

import type {LeaseStatisticReportState} from './types';

const defaultState: LeaseStatisticReportState = {
  attributes: null,
  isFetchingAttributes: false,
  leaseInvoicingConfirmationReportAttributes: null,
  isFetchingLeaseInvoicingConfirmationReportAttributes: false,
  leaseInvoicingConfirmationReport: null,
  isFetchingLeaseInvoicingConfirmationReport: false,
};

// $FlowFixMe
describe('Lease statistic', () => {

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

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
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

      it('should update isFetchingLeaseInvoicingConfirmationReportAttributes flag to true by fetchLeaseInvoicingConfirmationReportAttributes', () => {
        const newState = {...defaultState, isFetchingLeaseInvoicingConfirmationReportAttributes: true};

        const state = leaseStatisticReport({}, fetchLeaseInvoicingConfirmationReportAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingLeaseInvoicingConfirmationReportAttributes flag to false by leaseInvoicingConfirmationReportAttributesNotFound', () => {
        const newState = {...defaultState, isFetchingLeaseInvoicingConfirmationReportAttributes: false};

        let state: Object = leaseStatisticReport({}, fetchLeaseInvoicingConfirmationReportAttributes());
        state = leaseStatisticReport(state, leaseInvoicingConfirmationReportAttributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update LeaseInvoicingConfirmationReport attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, leaseInvoicingConfirmationReportAttributes: dummyAttributes};

        const state = leaseStatisticReport({}, receiveLeaseInvoicingConfirmationReportAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingLeaseInvoicingConfirmationReport flag to true when fetching LeaseInvoicingConfirmationReport', () => {
        const newState = {...defaultState, isFetchingLeaseInvoicingConfirmationReport: true};

        const state = leaseStatisticReport({}, fetchLeaseInvoicingConfrimationReports({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingLeaseInvoicingConfirmationReport flag to false by notFoundJobRuns', () => {
        const newState = {...defaultState, isFetchingLeaseInvoicingConfirmationReport: false};

        let state = leaseStatisticReport({}, fetchLeaseInvoicingConfrimationReports({}));
        state = leaseStatisticReport(state, notFoundLeaseInvoicingConfrimationReports());
        expect(state).to.deep.equal(newState);
      });

      it('should update LeaseInvoicingConfirmationReport', () => {
        const dummyLeaseInvoicingConfirmationReport = {
          count: 0,
          next: null,
          previous: null,
          results: [],
        };

        const newState = {...defaultState, isFetchingLeaseInvoicingConfirmationReport: false, leaseInvoicingConfirmationReport: dummyLeaseInvoicingConfirmationReport};

        const state = leaseStatisticReport({}, receiveLeaseInvoicingConfrimationReports(dummyLeaseInvoicingConfirmationReport));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
