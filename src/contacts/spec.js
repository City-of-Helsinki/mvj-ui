import {expect} from 'chai';
import {
  receiveCompleteContactList,
  receiveNewContactToCompleteList,
  receiveEditedContactToCompleteList,
  receiveAttributes,
  receiveSingleContact,
  initializeContactForm,
  receiveContactFormValid,
  showEditMode,
  hideEditMode,
  receiveLessors,
  receiveContacts,
  notFound,
} from './actions';
import contactReducer from './reducer';

describe('Contacts', () => {

  describe('Reducer', () => {

    describe('contactReducer', () => {
      it('should update complete contacts list', () => {
        const dummyContactsList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {
          allContacts: dummyContactsList,
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, receiveCompleteContactList(dummyContactsList));
        expect(state).to.deep.equal(newState);
      });

      it('should receive new contact to complete contact list', () => {
        const dummyContact = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          allContacts: [dummyContact],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, receiveNewContactToCompleteList(dummyContact));
        expect(state).to.deep.equal(newState);
      });

      it('should receive edited contact to complete contact list', () => {
        const dummyContactsList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const editedContact = {
          id: 2,
          label: 'Foo EDITED',
          name: 'Bar EDITED',
        };

        const editedContactsList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo EDITED',
            name: 'Bar EDITED',
          },
        ];

        const newState = {
          allContacts: editedContactsList,
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const stateTemp = contactReducer({}, receiveCompleteContactList(dummyContactsList));
        const state = contactReducer(stateTemp, receiveEditedContactToCompleteList(editedContact));

        expect(state).to.deep.equal(newState);
      });

      it('should update contact attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };

        const newState = {
          allContacts: [],
          attributes: dummyAttributes,
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update current contact', () => {
        const dummyContact = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: dummyContact,
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, receiveSingleContact(dummyContact));
        expect(state).to.deep.equal(newState);
      });

      it('should update contact form initial values', () => {
        const dummyContact = {
          id: 1,
          decision: [{id: 1}, {id: 2}],
          real_estate_ids: ['Bar'],
        };

        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: dummyContact,
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, initializeContactForm(dummyContact));
        expect(state).to.deep.equal(newState);
      });

      it('should update isContactFormValid flag to true', () => {
        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: true,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, receiveContactFormValid(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: true,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update all contacts list', () => {
        const dummyLessorsList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: dummyLessorsList,
          list: {},
        };

        const state = contactReducer({}, receiveLessors(dummyLessorsList));
        expect(state).to.deep.equal(newState);
      });

      it('should update contacts list', () => {
        const dummyContactsList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
          {
            id: 2,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {results: dummyContactsList},
        };

        const state = contactReducer({}, receiveContacts({results: dummyContactsList}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          allContacts: [],
          attributes: {},
          currentContact: {},
          initialContactFormValues: {
            decisions: [''],
            prices: [{}],
            real_estate_ids: [''],
          },
          isContactFormValid: false,
          isEditMode: false,
          isFetching: false,
          lessors: [],
          list: {},
        };

        const state = contactReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
