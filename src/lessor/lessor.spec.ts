import { describe, expect, it } from "vitest";
import { fetchLessors, receiveLessors } from "./actions";
import lessorReducer from "./reducer";
import type { LessorState } from "./types";
const defaultState: LessorState = {
  list: []
};

describe('Lessors', () => {
  describe('Reducer', () => {
    describe('lessorReducer', () => {
      it('fetchLessors should not change state', () => {
        const state = lessorReducer({}, fetchLessors());
        expect(state).to.deep.equal(defaultState);
      });
      it('receive lessor list', () => {
        const dummyLessors = [{
          foo: 'bar'
        }];
        const newState = { ...defaultState,
          list: dummyLessors
        };
        const state = lessorReducer({}, receiveLessors(dummyLessors));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});