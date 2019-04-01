// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchInvoiceNoteList,
  receiveInvoiceNoteList,
  notFound,
} from './actions';
import invoiceNoteReducer from './reducer';

import type {InvoiceNoteState} from './types';

const defaultState: InvoiceNoteState = {
  attributes: null,
  isFetching: false,
  isFetchingAttributes: false,
  list: {},
  methods: null,
};

// $FlowFixMe
describe('Invoice Note', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('invoiceNoteReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = invoiceNoteReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = invoiceNoteReducer({}, fetchAttributes());
        state = invoiceNoteReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = invoiceNoteReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};
        const newState = {...defaultState, methods: dummyMethods};

        const state = invoiceNoteReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoice notes', () => {
        const newState = {...defaultState, isFetching: true};

        const state = invoiceNoteReducer({}, fetchInvoiceNoteList({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = invoiceNoteReducer({}, fetchInvoiceNoteList({}));
        state = invoiceNoteReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update invoice note list', () => {
        const dummyList = {
          foo: 'bar',
        };
        const newState = {...defaultState};
        newState.list = dummyList;

        const state = invoiceNoteReducer({}, receiveInvoiceNoteList(dummyList));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
