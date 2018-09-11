import {expect} from 'chai';
import {
  fetchCollectionCostsByInvoice,
  receiveCollectionCostsByInvoice,
  collectionCostsNotFoundByInvoice,
} from './actions';
import debtCollectionReducer from './reducer';

const defaultState = {
  collectionCostsByInvoice: {},
  isFetchingCollectionCostsByInvoice: {},
};

describe('DectCollection', () => {

  describe('Reducer', () => {

    describe('debtCollectionReducer', () => {
      it('should update isFetchingCollectionDebtByInvoice flag to true when fetching collection const', () => {
        const newState = {...defaultState, isFetchingCollectionCostsByInvoice: {'1': true}};

        const state = debtCollectionReducer({}, fetchCollectionCostsByInvoice(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingCollectionDebtByInvoice flag to false by collectionCostsNotFoundByInvoice', () => {
        const newState = {...defaultState, isFetchingCollectionCostsByInvoice: {'1': false}};

        let state = debtCollectionReducer({}, collectionCostsNotFoundByInvoice(1));
        debtCollectionReducer(state, collectionCostsNotFoundByInvoice(1));

        expect(state).to.deep.equal(newState);
      });

      it('should update collectionCostsByInvoice', () => {
        const dummyPayload = {invoiceId: 1, collectionCosts: {foo: 'bar'}};
        const newState = {...defaultState,
          collectionCostsByInvoice: {[dummyPayload.invoiceId]: dummyPayload.collectionCosts},
          isFetchingCollectionCostsByInvoice: {[dummyPayload.invoiceId]: false},
        };

        const state = debtCollectionReducer({}, receiveCollectionCostsByInvoice(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
