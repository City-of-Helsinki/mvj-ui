// @flow
import {expect} from 'chai';

import {receiveLessors} from './actions';
import lessorReducer from './reducer';

import type {LessorState} from './types';

const defaultState: LessorState = {
  list: [],
};

describe('Lessors', () => {

  describe('Reducer', () => {

    describe('lessorReducer', () => {

      it('receive lessor list', () => {
        const dummyLessors = [{
          foo: 'bar',
        }];
        const newState = {...defaultState, list: dummyLessors};

        const state = lessorReducer({}, receiveLessors(dummyLessors));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
