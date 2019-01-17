// @flow
import {expect} from 'chai';

import {
  receiveAttributes,
  receiveMethods,
  fetchAttributes,
  attributesNotFound,
  receiveInvoicesByLease,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  receiveIsCreateClicked,
  receiveIsCreditClicked,
  receiveIsEditClicked,
  fetchInvoicesByLease,
  createInvoice,
  patchInvoice,
  receivePatchedInvoice,
  clearPatchedInvoice,
  notFound,
  receiveInvoiceToCredit,
} from './actions';
import invoiceReducer from './reducer';

import type {InvoiceState} from './types';

const defaultState: InvoiceState = {
  attributes: {},
  byLease: {},
  invoiceToCredit: null,
  isCreateClicked: false,
  isCreatePanelOpen: false,
  isCreditClicked: false,
  isCreditPanelOpen: false,
  isEditClicked: false,
  isFetching: false,
  isFetchingAttributes: false,
  methods: {},
  patchedInvoice: null,
};

// $FlowFixMe
describe('Invoices', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('invoiceReducer', () => {

      // $FlowFixMe
      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = invoiceReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...defaultState, methods: dummyMethods};

        const state = invoiceReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = invoiceReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should set isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = invoiceReducer({}, fetchAttributes());
        state = invoiceReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update invoices received by lease', () => {
        const dummyInvoices = [
          {
            id: 1,
            label: 'Foo',
          },
        ];
        const newState = {...defaultState, byLease: {'1': dummyInvoices}};

        const state = invoiceReducer({}, receiveInvoicesByLease({leaseId: 1, invoices: dummyInvoices}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreatePanelOpen flag to true', () => {
        const isCreatePanelOpen = true;
        const newState = {...defaultState, isCreatePanelOpen: isCreatePanelOpen};

        const state = invoiceReducer({}, receiveIsCreateInvoicePanelOpen(isCreatePanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateClicked flag to true', () => {
        const isCreateClicked = true;
        const newState = {...defaultState, isCreateClicked: isCreateClicked};

        const state = invoiceReducer({}, receiveIsCreateClicked(isCreateClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreditClicked flag to true', () => {
        const isCreditClicked = true;
        const newState = {...defaultState, isCreditClicked: isCreditClicked};

        const state = invoiceReducer({}, receiveIsCreditClicked(isCreditClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditClicked flag to true', () => {
        const isEditClicked = true;
        const newState = {...defaultState, isEditClicked: isEditClicked};

        const state = invoiceReducer({}, receiveIsEditClicked(isEditClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateCreditOpen flag to true', () => {
        const isCreditPanelOpen = true;
        const newState = {...defaultState, isCreditPanelOpen: isCreditPanelOpen};

        const state = invoiceReducer({}, receiveIsCreditInvoicePanelOpen(isCreditPanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoices', () => {
        const newState = {...defaultState, isFetching: true};

        const state = invoiceReducer({}, fetchInvoicesByLease(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating invoice', () => {
        const newState = {...defaultState, isFetching: true};

        const state = invoiceReducer({}, createInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when patching invoice', () => {
        const newState = {...defaultState, isFetching: true};

        const state = invoiceReducer({}, patchInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        const state = invoiceReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...defaultState, patchedInvoice: dummyInvoice};

        const state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        expect(state).to.deep.equal(newState);
      });

      it('should clear patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...defaultState, patchedInvoice: null};

        let state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        state = invoiceReducer(state, clearPatchedInvoice());
        expect(state).to.deep.equal(newState);
      });

      it('should update invoiceToCredit', () => {
        const newState = {...defaultState, invoiceToCredit: 'foo'};

        const state = invoiceReducer({}, receiveInvoiceToCredit('foo'));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
