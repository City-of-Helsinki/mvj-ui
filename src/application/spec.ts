import { expect } from "chai";
import applicationReducer from "@/application/reducer";
import type { ApplicationState } from "@/application/types";
import { attributesNotFound, fetchAttachmentAttributes, fetchAttributes, receiveAttachmentAttributes, receiveAttributes, receiveFormAttributes, receiveMethods } from "@/application/actions";
import mockFormAttributes from "@/application/form-attributes-mock-data.json";
import { companyIdentifierValidator, emailValidator, personalIdentifierValidator, validateApplicationForm } from "@/application/formValidation";
import { get } from "lodash/object";
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
  isPerformingFileOperation: false
};
describe('Application', () => {
  describe('Reducer', () => {
    describe('applicationReducer', () => {
      it('should update isFetchingAttributes flag to true', () => {
        const newState = { ...baseState,
          isFetchingAttributes: true
        };
        const state = applicationReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...baseState,
          attributes: dummyAttributes,
          isFetchingAttributes: false
        };
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
          PUT: true
        };
        const newState = { ...baseState,
          methods: dummyMethods
        };
        const state = applicationReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = { ...baseState,
          isFetchingAttributes: false
        };
        let state = applicationReducer({}, fetchAttributes());
        state = applicationReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });
      it('should update isFetchingAttachmentAttributes flag to true', () => {
        const newState = { ...baseState,
          isFetchingAttachmentAttributes: true
        };
        const state = applicationReducer({}, fetchAttachmentAttributes());
        expect(state).to.deep.equal(newState);
      });
      it('should update attachment attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar'
        };
        const newState = { ...baseState,
          attachmentAttributes: dummyAttributes,
          isFetchingAttachmentAttributes: false
        };
        const state = applicationReducer({ ...baseState
        }, receiveAttachmentAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });
    });
    it('should update form attributes', () => {
      const newState = { ...baseState,
        formAttributes: mockFormAttributes,
        isFetchingFormAttributes: false
      };
      const state = applicationReducer({ ...baseState,
        isFetchingFormAttributes: true
      }, receiveFormAttributes(mockFormAttributes));
      expect(state).to.deep.equal(newState);
    });
  });
  describe('validators', () => {
    describe('personalIdentifierValidator', () => {
      it('should ignore an empty identifier', () => {
        const error = personalIdentifierValidator('', 'fail');
        expect(error).to.not.exist;
      });
      it('should not accept a non-string value', () => {
        const error = personalIdentifierValidator({
          personalIdentifier: '180670-399C'
        }, 'fail');
        expect(error).to.equal('fail');
      });
      it('should accept a typical personal identifier from the 20th century', () => {
        const error = personalIdentifierValidator('180670-399C', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept a typical personal identifier from the 19th century', () => {
        const error = personalIdentifierValidator('090595+596K', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept a typical personal identifier from the 21st century', () => {
        const error = personalIdentifierValidator('090710A800U', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept a personal identifier using the newly adopted additional separator characters', () => {
        const error = personalIdentifierValidator('020504E347J', 'fail');
        expect(error).to.not.exist;
      });
      it('should not accept a personal identifier using an invalid separator character', () => {
        const error = personalIdentifierValidator('020504Z347J', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a personal identifier with too many characters', () => {
        const error = personalIdentifierValidator('18061970-399C', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a personal identifier with too few characters', () => {
        const error = personalIdentifierValidator('180670399C', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a personal identifier with an impossible date', () => {
        const error = personalIdentifierValidator('310298-144J', 'fail');
        expect(error).to.equal('fail');
      });
    });
    describe('companyIdentifierValidator', () => {
      it('should ignore an empty identifier', () => {
        const error = companyIdentifierValidator('', 'fail');
        expect(error).to.not.exist;
      });
      it('should not accept a non-string value', () => {
        const error = companyIdentifierValidator({
          companyIdentifier: '0346848-5'
        }, 'fail');
        expect(error).to.equal('fail');
      });
      it('should accept a modern format company identifier', () => {
        const error = companyIdentifierValidator('0346848-5', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept an old format company identifier', () => {
        const error = companyIdentifierValidator('346848-5', 'fail');
        expect(error).to.not.exist;
      });
      it('should not accept a company identifier with an invalid check number', () => {
        const error = companyIdentifierValidator('0346848-8', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a company identifier with a check number that is too long', () => {
        const error = companyIdentifierValidator('00346848-5', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a company identifier with a check number that is too short', () => {
        const error = companyIdentifierValidator('62202-9', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept a company identifier that is not in use due to a sum remainder of 1', () => {
        const error = companyIdentifierValidator('7453796-1', 'fail');
        expect(error).to.equal('fail');
      });
    });
    describe('emailValidator', () => {
      it('should accept a regular email address', () => {
        const error = emailValidator('example@gmail.com', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept a plus alias email address', () => {
        const error = emailValidator('example+mvj@gmail.com', 'fail');
        expect(error).to.not.exist;
      });
      it('should accept multiple dots on each side', () => {
        const error = emailValidator('example.user.of.the.mvj.service@gmail.by.google.com', 'fail');
        expect(error).to.not.exist;
      });
      it('should not accept an email address without anything before the at sign', () => {
        const error = emailValidator('@gmail.com', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept an email address without anything after the at sign', () => {
        const error = emailValidator('example@', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept an email address without an at sign', () => {
        const error = emailValidator('example.gmail.com', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept an email address with a space in it', () => {
        const error = emailValidator('example @gmail.com', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept an email address without a top level domain', () => {
        const error = emailValidator('example@gmail', 'fail');
        expect(error).to.equal('fail');
      });
      it('should not accept an email address with a one-letter top level domain', () => {
        const error = emailValidator('example@gmail.c', 'fail');
        expect(error).to.equal('fail');
      });
    });
    describe('validateApplicationForm', () => {
      it('should accept a simple form with a singular control value at a 100% ratio', () => {
        const error = validateApplicationForm('formEntries')({
          formEntries: {
            sections: {
              test: [{
                fields: {
                  hallintaosuus: {
                    value: '1 / 1',
                    extraValue: ''
                  }
                }
              }]
            }
          }
        });
        expect(Object.keys(error).length).to.be.equal(0);
      });
      it('should accept a simple form with multiple control values equaling a 100% ratio in total', () => {
        const error = validateApplicationForm('formEntries')({
          formEntries: {
            sections: {
              test: [{
                fields: {
                  hallintaosuus: {
                    value: '1 / 7',
                    extraValue: ''
                  }
                }
              }, {
                fields: {
                  hallintaosuus: {
                    value: '18 / 21',
                    extraValue: ''
                  }
                }
              }]
            }
          }
        });
        expect(Object.keys(error).length).to.be.equal(0);
      });
      it('should not accept a simple form with multiple control values not equaling a 100% ratio in total', () => {
        const error = validateApplicationForm('formEntries')({
          formEntries: {
            sections: {
              test: [{
                fields: {
                  hallintaosuus: {
                    value: '3 / 8',
                    extraValue: ''
                  }
                }
              }, {
                fields: {
                  hallintaosuus: {
                    value: '4 / 8',
                    extraValue: ''
                  }
                }
              }]
            }
          }
        });
        expect(get(error, 'formEntries.sections.test[0].fields.hallintaosuus.value')).to.equal('Hallintaosuuksien yhteismäärän on oltava 100%');
        expect(get(error, 'formEntries.sections.test[1].fields.hallintaosuus.value')).to.equal('Hallintaosuuksien yhteismäärän on oltava 100%');
      });
      it('should not care about unrelated fractional fields when validating the control share ratio', () => {
        const error = validateApplicationForm('formEntries')({
          formEntries: {
            sections: {
              test: [{
                fields: {
                  hallintaosuus: {
                    value: '9 / 9',
                    extraValue: ''
                  },
                  arvostelu: {
                    value: '5 / 7',
                    extraValue: ''
                  }
                }
              }]
            }
          }
        });
        expect(Object.keys(error).length).to.be.equal(0);
      });
    });
  });
});