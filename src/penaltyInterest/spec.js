// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchPenaltyInterestByInvoice,
  receivePenaltyInterestByInvoice,
  penaltyInterestNotFoundByInvoice,
} from './actions';
import penaltyInterestReducer from './reducer';

import type {PenaltyInterestState} from './types';

const defaultState: PenaltyInterestState = {
  attributes: {},
  byInvoice: {},
  isFetchingAttributes: false,
  isFetchingByInvoice: {},
  methods: {},
};

// $FlowFixMe
describe('PenaltyInterest', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('penaltyInterestReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = penaltyInterestReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = penaltyInterestReducer({}, fetchAttributes());
        state = penaltyInterestReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = penaltyInterestReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = penaltyInterestReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPenaltyInterestByInvoice flag to true when fetching', () => {
        const invoice = 1;
        const newState = {...defaultState, isFetchingByInvoice: {[invoice]: true}};

        const state = penaltyInterestReducer({}, fetchPenaltyInterestByInvoice(invoice));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingPenaltyInterestByInvoice flag to false by penaltyInterestNotFoundByInvoice', () => {
        const invoice = 1;
        const newState = {...defaultState, isFetchingByInvoice: {[invoice]: false}};

        let state = penaltyInterestReducer({}, penaltyInterestNotFoundByInvoice(invoice));
        penaltyInterestReducer(state, penaltyInterestNotFoundByInvoice(invoice));

        expect(state).to.deep.equal(newState);
      });

      it('should update penaltyInterestByInvoice', () => {
        const invoice = 1;
        const dummyPayload = {invoiceId: invoice, penaltyInterest: {foo: 'bar'}};
        const newState = {...defaultState,
          byInvoice: {[dummyPayload.invoiceId]: dummyPayload.penaltyInterest},
          isFetchingByInvoice: {[dummyPayload.invoiceId]: false},
        };

        const state = penaltyInterestReducer({}, receivePenaltyInterestByInvoice(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
