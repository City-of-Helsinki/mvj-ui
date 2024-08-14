import { describe, expect, it } from "vitest";
import { fetchAttributes, attributesNotFound, receiveAttributes, fetchReceivableTypes, receivableTypesNotFound, receiveReceivableTypes } from "./actions";
import leaseCreateChargeReducer from "./reducer";
import type { LeaseCreateChargeState } from "./types";
import { receivableTypesFromAttributes } from "./helpers";
const defaultState: LeaseCreateChargeState = {
  attributes: null,
  isFetchingAttributes: false,
  receivableTypes: null,
  isFetchingReceivableTypes: false
};

describe('Lease create charge', () => {
  describe('Reducer', () => {
    describe('leaseCreateChargeReducer', () => {
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: true
        };
        const state = leaseCreateChargeReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttributes flag to true by attributesNotFound', () => {
        const newState = { ...defaultState,
          isFetchingAttributes: false
        };
        let state = leaseCreateChargeReducer({}, fetchAttributes());
        state = leaseCreateChargeReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update attributes', () => {
        const dummyAttributes = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          attributes: dummyAttributes
        };
        const state = leaseCreateChargeReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingReceivableTypes flag to true by fetchReceivableTypes', () => {
        const newState = { ...defaultState,
          isFetchingReceivableTypes: true
        };
        const state = leaseCreateChargeReducer({}, fetchReceivableTypes());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingReceivableTypes flag to true by receivableTypesNotFound', () => {
        const newState = { ...defaultState,
          isFetchingReceivableTypes: false
        };
        let state = leaseCreateChargeReducer({}, fetchReceivableTypes());
        state = leaseCreateChargeReducer(state, receivableTypesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update receivableTypes', () => {
        const dummyReceivableTypes = {
          foo: 'bar'
        };
        const newState = { ...defaultState,
          receivableTypes: dummyReceivableTypes
        };
        const state = leaseCreateChargeReducer({}, receiveReceivableTypes(dummyReceivableTypes));
        expect(state).to.deep.equal(newState);
      });
    });
  });
  describe('Helpers', () => {
    describe('receivableTypesFromAttributes', () => {
      it('should filter only active receivableTypes as choices', () => {
        const dummyFieldAttributes = {
          type: "field",
          required: true,
          read_only: false,
          label: "Receivable type",
          choices: [{
            value: 1,
            display_name: "Maanvuokraus"
          }, {
            value: 3,
            display_name: "Yhteismarkkinointi (sis. ALV)"
          }, {
            value: 4,
            display_name: "Kiinteistötoimitukset (tonttijaot, lohkomiset, rekisteröimiskustannukset, rasitteet)"
          }, {
            value: 5,
            display_name: "Haastemiestiedoksianto"
          }, {
            value: 6,
            display_name: "Rasite ja muut vastaavat korvaukset"
          }, {
            value: 7,
            display_name: "Esirakentamistoimenpiteet"
          }, {
            value: 9,
            display_name: "Väestösuojakorvaus"
          }, {
            value: 2,
            display_name: "Korko"
          }, {
            value: 8,
            display_name: "Rahavakuus"
          }, {
            value: 10,
            display_name: "Maanvuokraus"
          }, {
            value: 11,
            display_name: "Rahavakuus"
          }, {
            value: 12,
            display_name: "Maanvuokraus"
          }, {
            value: 13,
            display_name: "Rahavakuus"
          }, {
            value: 14,
            display_name: "Maanvuokraus"
          }, {
            value: 15,
            display_name: "Rahavakuus"
          }, {
            value: 16,
            display_name: "Maanvuokraus"
          }, {
            value: 17,
            display_name: "Rahavakuus"
          }]
        };
        const dummyReceivableTypes = [{
          id: 1,
          name: "Maanvuokraus",
          sap_material_code: null,
          sap_order_item_number: null,
          is_active: true,
          service_unit: 1
        }, {
          id: 2,
          name: "Korko",
          sap_material_code: null,
          sap_order_item_number: null,
          is_active: false,
          service_unit: 1
        }];
        const {
          choices
        } = receivableTypesFromAttributes(dummyFieldAttributes, dummyReceivableTypes);
        expect(choices).to.deep.equal([{
          value: 1,
          display_name: "Maanvuokraus"
        }]);
      });
    });
  });
});