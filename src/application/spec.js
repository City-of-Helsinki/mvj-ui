// @flow

import {expect} from 'chai';

import applicationReducer from '$src/application/reducer';
import type {ApplicationState} from '$src/application/types';
import {
  attributesNotFound,
  fetchAttachmentAttributes,
  fetchAttributes,
  receiveAttachmentAttributes, receiveAttributes,
  receiveFormAttributes, receiveMethods,
} from '$src/application/actions';
import mockFormAttributes from '$src/application/form-attributes-mock-data.json';

const baseState: ApplicationState = {
  attributes: null,
  methods: null,
  isFetchingAttributes: false,
  applicantInfoCheckAttributes: null,
  attachmentAttributes: null,
  attachmentMethods: null,
  isFetchingAttachmentAttributes: false,
  isFetchingApplicantInfoCheckAttributes: false,
  isFetchingFormAttributes: false,
  fieldTypeMapping: {},
  formAttributes: null,
  pendingUploads: [],
  isFetchingPendingUploads: false,
  applicationAttachments: null,
  isFetchingApplicationAttachments: false,
  isPerformingFileOperation: false,
};

describe('Application', () => {
  describe('Reducer', () => {
    describe('applicationReducer', () => {
      it('should update isFetchingAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttributes: true};

        const state = applicationReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState, attributes: dummyAttributes, isFetchingAttributes: false};

        const state = applicationReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {
          PATCH: true,
          DELETE: true,
          GET: true,
          HEAD: true,
          POST: true,
          OPTIONS: true,
          PUT: true,
        };
        const newState = {...baseState, methods: dummyMethods};

        const state = applicationReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...baseState, isFetchingAttributes: false};

        let state = applicationReducer({}, fetchAttributes());
        state = applicationReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttachmentAttributes flag to true', () => {
        const newState = {...baseState, isFetchingAttachmentAttributes: true};

        const state = applicationReducer({}, fetchAttachmentAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update attachment attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          ...baseState,
          attachmentAttributes: dummyAttributes,
          isFetchingAttachmentAttributes: false,
        };

        const state = applicationReducer({
          ...baseState,
        }, receiveAttachmentAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
    });

    it('should update form attributes', () => {
      const newState = {
        ...baseState,
        formAttributes: mockFormAttributes,
        isFetchingFormAttributes: false,
      };

      const state = applicationReducer({
        ...baseState,
        isFetchingFormAttributes: true,
      }, receiveFormAttributes(mockFormAttributes));
      expect(state).to.deep.equal(newState);
    });
  });
});
