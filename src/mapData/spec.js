import {expect} from 'chai';
import {
  receiveMapDataByType,
  fetchMapDataByType,
  notFound,
} from './actions';
import mapDataReducer from './reducer';

describe('Map data', () => {

  describe('Reducer', () => {

    describe('mapDataReducer', () => {

      it('should update map data', () => {
        const dummyMapData = {
          type: 'test',
          data: {
            id: 1,
            label: 'Foo',
          },
        };

        const newState = {
          byType: {[dummyMapData.type]: dummyMapData.data},
          isFetching: false,
        };

        const state = mapDataReducer({}, receiveMapDataByType(dummyMapData));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching map data', () => {
        const newState = {
          byType: {},
          isFetching: true,
        };

        const state = mapDataReducer({}, fetchMapDataByType());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {
          byType: {},
          isFetching: false,
        };

        let state = mapDataReducer({}, fetchMapDataByType());
        state = mapDataReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
