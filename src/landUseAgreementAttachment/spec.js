// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  createLandUseAgreementAttachment,
  deleteLandUseAgreementAttachment,
} from './actions';
import landUseAgreementAttachmentReducer from './reducer';

import type {LandUseAgreementAttachmentState} from './types';

const defaultState: LandUseAgreementAttachmentState = {
  attributes: null,
  isFetchingAttributes: false,
  methods: null,
};

// $FlowFixMe
describe('Land Use Agreement attachment', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('landUseAgreementAttachmentReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true by fetchAttributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = landUseAgreementAttachmentReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = landUseAgreementAttachmentReducer({}, fetchAttributes());
        state = landUseAgreementAttachmentReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, attributes: dummyAttributes};

        const state = landUseAgreementAttachmentReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...defaultState, methods: dummyMethods};

        const state = landUseAgreementAttachmentReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('createLandUseAgreementAttachment should not change state', () => {
        const state = landUseAgreementAttachmentReducer({}, createLandUseAgreementAttachment({
          id: 1,
          data: {},
          file: {},
          type: 'general',
        }));

        expect(state).to.deep.equal(defaultState);
      });

      it('deleteLandUseAgreementAttachment should not change state', () => {
        const state = landUseAgreementAttachmentReducer({}, deleteLandUseAgreementAttachment({
          id: 1,
          fileId: 1,
        }));

        expect(state).to.deep.equal(defaultState);
      });
    });
  });
});
