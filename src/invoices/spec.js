import {expect} from 'chai';
import {
  receiveAttributes,
  receiveInvoices,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  fetchInvoices,
  createInvoice,
  patchInvoice,
  receivePatchedInvoice,
  clearPatchedInvoice,
  notFound,
} from './actions';
import invoiceReducer from './reducer';

const rootState = {
  attributes: {},
  invoices: [],
  isCreatePanelOpen: false,
  isCreditPanelOpen: false,
  isFetching: false,
  patchedInvoice: null,
};

describe('Invoices', () => {

  describe('Reducer', () => {

    describe('invoiceReducer', () => {

      it('should update contact attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...rootState};
        newState.attributes = dummyAttributes;

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
        const newState = {...rootState};
        newState.invoices = dummyInvoices;

        const state = invoiceReducer({}, receiveInvoices(dummyInvoices));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateOpen flag to false', () => {
        const isCreatePanelOpen = true;
        const newState = {...rootState};
        newState.isCreatePanelOpen = isCreatePanelOpen;

        const state = invoiceReducer({}, receiveIsCreateInvoicePanelOpen(isCreatePanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateCreditOpen flag to false', () => {
        const isCreditPanelOpen = true;
        const newState = {...rootState};
        newState.isCreditPanelOpen = isCreditPanelOpen;

        const state = invoiceReducer({}, receiveIsCreditInvoicePanelOpen(isCreditPanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoices', () => {
        const newState = {...rootState};
        newState.isFetching = true;

        const state = invoiceReducer({}, fetchInvoices());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating invoice', () => {
        const newState = {...rootState};
        newState.isFetching = true;

        const state = invoiceReducer({}, createInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when patching invoice', () => {
        const newState = {...rootState};
        newState.isFetching = true;

        const state = invoiceReducer({}, patchInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...rootState};
        newState.isFetching = false;

        let state = invoiceReducer({}, fetchInvoices());
        state = invoiceReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...rootState};
        newState.patchedInvoice = dummyInvoice;

        const state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        expect(state).to.deep.equal(newState);
      });

      it('should clear patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...rootState};
        newState.patchedInvoice = null;

        let state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        state = invoiceReducer(state, clearPatchedInvoice());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
