// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchPreviewInvoices,
  receivePreviewInvoices,
  clearPreviewInvoices,
  notFound,
} from './actions';
import previewInvoicesReducer from './reducer';

import type {PreviewInvoicesState} from './types';

const defaultState: PreviewInvoicesState = {
  attributes: {},
  isFetching: false,
  isFetchingAttributes: false,
  list: null,
  methods: {},
};

// $FlowFixMe
describe('Preview invoices', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('previewInvoicesReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = previewInvoicesReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = previewInvoicesReducer({}, fetchAttributes());
        state = previewInvoicesReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = previewInvoicesReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};

        const newState = {...defaultState, methods: dummyMethods};

        const state = previewInvoicesReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should clear preview invoices', () => {
        const dummyPreviewInvoices = [
          {
            id: 1,
            label: 'Foo',
          },
        ];
        const newState = {...defaultState};

        let state = previewInvoicesReducer({}, receivePreviewInvoices([dummyPreviewInvoices]));
        state = previewInvoicesReducer(state, clearPreviewInvoices());
        expect(state).to.deep.equal(newState);
      });

      it('should update preview invoices', () => {
        const dummyPreviewInvoices = [
          {
            id: 1,
            label: 'Foo',
          },
        ];
        const newState = {...defaultState, list: [dummyPreviewInvoices]};

        const state = previewInvoicesReducer({}, receivePreviewInvoices([dummyPreviewInvoices]));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching preview invoices', () => {
        const newState = {...defaultState, isFetching: true};

        const state = previewInvoicesReducer({}, fetchPreviewInvoices({lease: 1}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = previewInvoicesReducer({}, fetchPreviewInvoices({lease: 1}));
        state = previewInvoicesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
