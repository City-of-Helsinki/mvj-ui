import {expect} from 'chai';
import {
  receiveAttributes,
  receiveSingleContact,
  initializeContactForm,
  receiveContactFormValid,
  showEditMode,
  hideEditMode,
  receiveContacts,
  fetchContacts,
  fetchSingleContact,
  createContact,
  editContact,
  notFound,
  receiveIsSaveClicked,
} from './actions';
import contactReducer from './reducer';

const stateTemplate = {
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
  isSaveClicked: false,
  list: {},
};

describe('Contacts', () => {

  describe('Reducer', () => {

    describe('contactReducer', () => {
      it('should update contact attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };

        const newState = {...stateTemplate};
        newState.attributes = dummyAttributes;

        const state = contactReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching contacts', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = contactReducer({}, fetchContacts(''));
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

        const newState = {...stateTemplate};
        newState.list = {results: dummyContactsList};

        const state = contactReducer({}, receiveContacts({results: dummyContactsList}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single contact', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = contactReducer({}, fetchSingleContact(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current contact', () => {
        const dummyContact = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...stateTemplate};
        newState.currentContact = dummyContact;

        const state = contactReducer({}, receiveSingleContact(dummyContact));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by createContact', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = contactReducer({}, createContact());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true by editContact', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = contactReducer({}, editContact());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...stateTemplate};
        newState.isFetching = false;

        const state = contactReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update contact form initial values', () => {
        const dummyContact = {
          id: 1,
          decision: [{id: 1}, {id: 2}],
          real_estate_ids: ['Bar'],
        };

        const newState = {...stateTemplate};
        newState.initialContactFormValues = dummyContact;

        const state = contactReducer({}, initializeContactForm(dummyContact));
        expect(state).to.deep.equal(newState);
      });

      it('should update isContactFormValid flag to true', () => {
        const newState = {...stateTemplate};
        newState.isContactFormValid = true;

        const state = contactReducer({}, receiveContactFormValid(true));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {...stateTemplate};
        newState.isEditMode = true;

        const state = contactReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {...stateTemplate};
        newState.isEditMode = false;

        const state = contactReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...stateTemplate};
        newState.isSaveClicked = true;

        const state = contactReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
