import {expect} from 'chai';
import {
  receiveLandUseContractAttributes,
  fetchLandUseContractList,
  receiveLandUseContractList,
  fetchSingleLandUseContract,
  receiveSingleLandUseContract,
  notFound,
  hideEditMode,
  showEditMode,
} from './actions';
import landUseContractReducer from './reducer';

const baseState = {
  attributes: {},
  current: {},
  isEditMode: false,
  isFetching: false,
  list: {},
};

describe('Land use contract', () => {

  describe('Reducer', () => {

    describe('landUseContractReducer', () => {

      it('should update attributes', () => {
        const dummyAttributes = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.attributes = dummyAttributes;

        const state = landUseContractReducer({}, receiveLandUseContractAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching land use contract list', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state = landUseContractReducer({}, fetchLandUseContractList(''));
        expect(state).to.deep.equal(newState);
      });

      it('should update land use contract list', () => {
        const dummyLandUseContractList = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...baseState};
        newState.list = dummyLandUseContractList;

        const state = landUseContractReducer({}, receiveLandUseContractList(dummyLandUseContractList));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching single land use contract', () => {
        const newState = {...baseState};
        newState.isFetching = true;

        const state =landUseContractReducer({}, fetchSingleLandUseContract(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update current land use contract', () => {
        const dummyLandUseContract = {
          id: 1,
          label: 'Foo',
          name: 'Bar',
        };

        const newState = {...baseState};
        newState.current = dummyLandUseContract;

        const state = landUseContractReducer({}, receiveSingleLandUseContract(dummyLandUseContract));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...baseState};
        newState.isFetching = false;

        const state = landUseContractReducer({}, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false by hideEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = false;

        const state = landUseContractReducer({}, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true by showEditMode', () => {
        const newState = {...baseState};
        newState.isEditMode = true;

        const state = landUseContractReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
