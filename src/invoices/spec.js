import {expect} from 'chai';
import {
  receiveAttributes,
  receiveInvoices,
  receiveIsCreateOpen,
  fetchInvoices,
  createInvoice,
  patchInvoice,
  notFound,
} from './actions';
import invoiceReducer from './reducer';

describe('Invoices', () => {

  describe('Reducer', () => {

    describe('invoiceReducer', () => {

      it('should update contact attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };

        const newState = {
          attributes: dummyAttributes,
          invoices: [],
          isCreateOpen: false,
          isFetching: false,
        };

        const state = invoiceReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update invoices received by lease', () => {
        const dummyInvoices = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {
          attributes: {},
          invoices: dummyInvoices,
          isCreateOpen: false,
          isFetching: false,
        };

        const state = invoiceReducer({}, receiveInvoices(dummyInvoices));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateOpen flag to false', () => {
        const isCreateOpen = true;
        const newState = {
          attributes: {},
          invoices: [],
          isCreateOpen: isCreateOpen,
          isFetching: false,
        };

        const state = invoiceReducer({}, receiveIsCreateOpen(isCreateOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoices', () => {
        const newState = {
          attributes: {},
          invoices: [],
          isCreateOpen: false,
          isFetching: true,
        };

        const state = invoiceReducer({}, fetchInvoices());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating invoice', () => {
        const newState = {
          attributes: {},
          invoices: [],
          isCreateOpen: false,
          isFetching: true,
        };

        const state = invoiceReducer({}, createInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when patching invoice', () => {
        const newState = {
          attributes: {},
          invoices: [],
          isCreateOpen: false,
          isFetching: true,
        };

        const state = invoiceReducer({}, patchInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          attributes: {},
          invoices: [],
          isCreateOpen: false,
          isFetching: false,
        };

        let state = invoiceReducer({}, fetchInvoices());
        state = invoiceReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
