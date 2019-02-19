// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
} from './actions';
import infillDevelopmentAttachmentReducer from './reducer';

import type {InfillDevelopmentAttachmentState} from './types';

const defaultState: InfillDevelopmentAttachmentState = {
  attributes: null,
  isFetchingAttributes: false,
  methods: null,
};

describe('Infill development attachment', () => {

  describe('Reducer', () => {

    describe('infillDevelopmentAttachmentReducer', () => {

      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = infillDevelopmentAttachmentReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = infillDevelopmentAttachmentReducer({}, fetchAttributes());
        state = infillDevelopmentAttachmentReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = infillDevelopmentAttachmentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, methods: dummyMethods};

        const state = infillDevelopmentAttachmentReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
