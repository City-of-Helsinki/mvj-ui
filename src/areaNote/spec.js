import {expect} from 'chai';
import {
  receiveAreaNoteList,
  receiveDeletedAreaNote,
  receiveEditedAreaNote,
  fetchAreaNoteList,
  createAreaNote,
  deleteAreaNote,
  editAreaNote,
  notFound,
  showEditMode,
  hideEditMode,
  initializeAreaNote,
} from './actions';
import areaNotesReducer from './reducer';

const stateTemplate = {
  initialValues: {
    id: -1,
    geoJSON: {},
    isNew: true,
    note: '',
  },
  isEditMode: false,
  isFetching: false,
  list: [],
};

describe('AreaNoteList', () => {

  describe('Reducer', () => {

    describe('areaNotesReducer', () => {

      it('should update area notes list', () => {
        const dummyAreaNotes = [
          {
            id: 1,
            label: 'Foo',
          },
        ];

        const newState = {...stateTemplate};
        newState.list = dummyAreaNotes;

        const state = areaNotesReducer({}, receiveAreaNoteList(dummyAreaNotes));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching area notes', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = areaNotesReducer({}, fetchAreaNoteList());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating area note', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = areaNotesReducer({}, createAreaNote());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving created area note', () => {
        const dummyAreaNote = {
          id: 1,
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.isFetching = false;
        newState.list = [dummyAreaNote];

        let state = areaNotesReducer({}, createAreaNote(dummyAreaNote));
        state = areaNotesReducer(state, receiveEditedAreaNote(dummyAreaNote));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false when receiving deleted area note', () => {
        const dummyAreaNote = {
          id: 1,
          foo: 'bar',
        };
        const newState = {...stateTemplate};
        newState.isFetching = false;

        let state = areaNotesReducer({}, receiveEditedAreaNote(dummyAreaNote));
        state = areaNotesReducer(state, receiveDeletedAreaNote(1));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when deleting area note', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = areaNotesReducer({}, deleteAreaNote());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when editing area note', () => {
        const newState = {...stateTemplate};
        newState.isFetching = true;

        const state = areaNotesReducer({}, editAreaNote());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound action', () => {
        const newState = {...stateTemplate};
        newState.isFetching = false;

        let state = areaNotesReducer({}, editAreaNote());
        state = areaNotesReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to true', () => {
        const newState = {...stateTemplate};
        newState.isEditMode = true;

        const state = areaNotesReducer({}, showEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditMode flag to false', () => {
        const newState = {...stateTemplate};
        newState.isFetching = false;

        let state = areaNotesReducer({}, showEditMode());
        state = areaNotesReducer(state, hideEditMode());
        expect(state).to.deep.equal(newState);
      });

      it('should update initial values', () => {
        const newState = {...stateTemplate};
        newState.initialValues = {};

        const state = areaNotesReducer({}, initializeAreaNote({}));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
