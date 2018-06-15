import {expect} from 'chai';
import {
  fetchInfillDevelopments,
  fetchSingleInfillDevelopment,
  hideEditMode,
  notFound,
  receiveInfillDevelopmentAttributes,
  receiveInfillDevelopments,
  receiveSingleInfillDevelopment,
  receiveFormInitialValues,
  createInfillDevelopment,
  editInfillDevelopment,
  showEditMode,
  receiveFormValidFlags,
  clearFormValidFlags,
  receiveIsSaveClicked,
} from './actions';
import infillDevelopmentReducer from './reducer';

const baseState = {
  attributes: {},
  current: {},
  initialValues: {},
  isEditMode: false,
  isFetching: false,
  isFormValidById: {
    'infill-development-form': true,
  },
  isSaveClicked: false,
  list: {},
};

describe('Infill development', () => {

  describe('Reducer', () => {

    describe('infillDevelopmentReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.attributes = dummyAttributes;

        const state =infillDevelopmentReducer({}, receiveInfillDevelopmentAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update infill development list', () => {
        const dummyInfillDevelopmentList = [
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

        const newState = {...baseState};
        newState.list = dummyInfillDevelopmentList;

        const state =infillDevelopmentReducer({}, receiveInfillDevelopments(dummyInfillDevelopmentList));
        expect(state).to.deep.equal(newState);
      });

      it('should update current infill development', () => {
        const dummyInfillDevelopment = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyInfillDevelopment;

        const state =infillDevelopmentReducer({}, receiveSingleInfillDevelopment(dummyInfillDevelopment));
        expect(state).to.deep.equal(newState);
      });

      it('should update form initial values', () => {
        const dummyInfillDevelopment = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.initialValues = dummyInfillDevelopment;

        const state =infillDevelopmentReducer({}, receiveFormInitialValues(dummyInfillDevelopment));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching infill developments', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, fetchInfillDevelopments(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single infill development', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, fetchSingleInfillDevelopment(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating infill development', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, createInfillDevelopment(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing infill development', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = infillDevelopmentReducer({}, editInfillDevelopment(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...baseState};

        const state = infillDevelopmentReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = infillDevelopmentReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = infillDevelopmentReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFormValidById value', () => {
        const dummyFlags = {
          'infill-development-form': true,
        };

        const newState = {...baseState};
        newState.isFormValidById = dummyFlags;

        const state = infillDevelopmentReducer({}, receiveFormValidFlags(dummyFlags));
        expect(state).to.deep.equal(newState);
      });

      it('should clear isFormValidById value', () => {
        const dummyFlags = {
          'infill-development-form': true,
        };
        const newState = {...baseState};


        let state = infillDevelopmentReducer({}, receiveFormValidFlags(dummyFlags));
        state = infillDevelopmentReducer(state, clearFormValidFlags());
        expect(state).to.deep.equal(newState);
      });

      it('should update isSaveClicked', () => {
        const newState = {...baseState};
        newState.isSaveClicked = true;

        const state = infillDevelopmentReducer({}, receiveIsSaveClicked(true));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
