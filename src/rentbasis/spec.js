import {expect} from 'chai';
import {
  receiveAttributes,
  fetchRentBasisList,
  receiveRentBasisList,
  fetchSingleRentBasis,
  receiveSingleRentBasis,
  createRentBasis,
  editRentBasis,
  initializeRentBasis,
  showEditMode,
  hideEditMode,
  receiveFormValid,
  notFound,
} from './actions';
import rentBasisReducer from './reducer';

describe('Rent basis', () => {

  describe('Reducer', () => {

    describe('rentBasisReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          val1: 'foo',
          val2: 'bar',
        };

        const newState = {
          attributes: dummyAttributes,
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching rent basis list', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: true,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, fetchRentBasisList());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving rent basis list', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        let state = rentBasisReducer({}, fetchRentBasisList());
        state = rentBasisReducer(state, receiveRentBasisList({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single rent basis', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: true,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, fetchSingleRentBasis(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving single rent basis', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        let state = rentBasisReducer({}, fetchSingleRentBasis(1));
        state = rentBasisReducer(state, receiveSingleRentBasis({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating new rent basis', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: true,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, createRentBasis({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing existing rent basis', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: true,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, editRentBasis({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        let state = rentBasisReducer({}, fetchRentBasisList());
        state = rentBasisReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update rent basis list', () => {
        const dummyRentBasisList = [
          {
            id: 1,
            name: 'foo',
          },
          {
            id: 2,
            name: 'bar',
          },
        ];
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {results: dummyRentBasisList},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, receiveRentBasisList({results: dummyRentBasisList}));
        expect(state).to.deep.equal(newState);
      });

      it('should update single rent basis', () => {
        const dummyRentBasis = {
          val1: 'foo',
          val2: 'bar',
        };

        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: dummyRentBasis,
        };

        const state = rentBasisReducer({}, receiveSingleRentBasis(dummyRentBasis));
        expect(state).to.deep.equal(newState);
      });

      it('should update rent basis form initial values', () => {
        const dummyRentBasis = {
          val1: 'foo',
          val2: 'bar',
        };

        const newState = {
          attributes: {},
          initialValues: dummyRentBasis,
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, initializeRentBasis(dummyRentBasis));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: true,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: false,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        let state = rentBasisReducer({}, showEditMode());
        state = rentBasisReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValid flag to true', () => {
        const newState = {
          attributes: {},
          initialValues: {
            decisions: [{}],
            property_identifiers: [{}],
            rent_rates: [{}],
          },
          isEditMode: false,
          isFormValid: true,
          isFetching: false,
          list: {},
          rentbasis: {},
        };

        const state = rentBasisReducer({}, receiveFormValid(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
