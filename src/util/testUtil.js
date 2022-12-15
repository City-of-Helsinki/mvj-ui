// @flow

import type {RootState} from '../root/types';
import {createStore} from 'redux';
import {createMemoryHistory} from 'history';
import createRootReducer from '../root/createRootReducer';


export const getTestRootState = (overrides?: $Shape<RootState> = {}): RootState => {
  const history = createMemoryHistory();
  const rootState = createStore(createRootReducer(history));
  return {
    ...rootState.getState(),
    ...overrides,
  };
};
