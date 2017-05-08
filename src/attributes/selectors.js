// @flow

import type {Selector} from '../types';
import type {AttributesState} from './types';

// export const getIsFetching: Selector<boolean, void> = (state): AttributesState =>
//   state.user.isFetching;

export const getAttributes: Selector<AttributesState, void> = (state: Object): AttributesState =>
  state.attributes;
