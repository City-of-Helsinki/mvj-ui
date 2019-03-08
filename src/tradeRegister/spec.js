// @flow
import {expect} from 'chai';

import {
  fetchTradeRegisterCompanyExtendedById,
  companyExtendedNotFoundById,
  receiveTradeRegisterCompanyExtendedById,
  receiveCollapseStates,
} from './actions';
import tradeRegisterReducer from './reducer';

import type {TradeRegisterState} from './types';

const defaultState: TradeRegisterState = {
  collapseStates: {},
  companyExtendedById: {},
  isFetchingCompanyExtendedById: {},
};

// $FlowFixMe
describe('Trade register', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('tradeRegisterReducer', () => {

      // $FlowFixMe
      it('should update isFetchingCompanyExtendedById to true when fetching company extended info', () => {
        const dummyBusinessId = '123';

        const newState = {...defaultState, isFetchingCompanyExtendedById: {
          [dummyBusinessId]: true,
        }};

        const state = tradeRegisterReducer({}, fetchTradeRegisterCompanyExtendedById(dummyBusinessId));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingCompanyExtendedById to false when by companyExtendednotFoundById', () => {
        const dummyBusinessId = '123';

        const newState = {...defaultState, isFetchingCompanyExtendedById: {
          [dummyBusinessId]: false,
        }};

        let state = tradeRegisterReducer({}, fetchTradeRegisterCompanyExtendedById(dummyBusinessId));
        state = tradeRegisterReducer(state, companyExtendedNotFoundById(dummyBusinessId));
        expect(state).to.deep.equal(newState);
      });

      it('should update companyExtendedById', () => {
        const dummyBusinessId = '123';
        const dummyPayload = {
          [dummyBusinessId]: {foo: 'bar'},
        };

        const newState = {
          ...defaultState,
          companyExtendedById: dummyPayload,
          isFetchingCompanyExtendedById: {
            [dummyBusinessId]: false,
          },
        };

        const state = tradeRegisterReducer({}, receiveTradeRegisterCompanyExtendedById(dummyPayload));
        expect(state).to.deep.equal(newState);
      });

      it('should update collapseStates', () => {
        const dummyPayload = {'123': false};

        const newState = {...defaultState, collapseStates: dummyPayload};

        const state = tradeRegisterReducer({}, receiveCollapseStates(dummyPayload));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
