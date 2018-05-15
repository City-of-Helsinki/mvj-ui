// @flow
import type {Selector} from '../types';
import type {RememberableTermList, RememberableTermState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RememberableTermState): boolean =>
  state.rememberableterm.isFetching;

export const getRememberableTermList: Selector<RememberableTermList, void> = (state: RememberableTermState): RememberableTermList =>
  state.rememberableterm.list;
