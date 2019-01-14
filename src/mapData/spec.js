// @flow
import {expect} from 'chai';

import {
  receiveMapDataByType,
  fetchMapDataByType,
  notFound,
} from './actions';
import mapDataReducer from './reducer';

import type {MapDataState} from './types';

const defaultState: MapDataState = {
  byType: {},
  isFetching: false,
};

// $FlowFixMe
describe('Map data', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('mapDataReducer', () => {

      // $FlowFixMe
      it('should update map data', () => {
        const dummyMapData = {
          type: 'test',
          data: {
            id: 1,
            label: 'Foo',
          },
        };

        const newState = {...defaultState,  byType: {[dummyMapData.type]: dummyMapData.data}};

        const state = mapDataReducer({}, receiveMapDataByType(dummyMapData));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching map data', () => {
        const newState = {...defaultState, isFetching: true};

        const state = mapDataReducer({}, fetchMapDataByType('type'));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...defaultState, isFetching: false};

        let state = mapDataReducer({}, fetchMapDataByType('type'));
        state = mapDataReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
