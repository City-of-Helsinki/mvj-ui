// @flow
import type {Selector} from '../types';
import type {RememberableTermList, RememberableTermState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RememberableTermState): boolean =>
  state.rememberableterm.isFetching;

export const getIsEditMode: Selector<boolean, void> = (state: RememberableTermState): boolean =>
  state.rememberableterm.isEditMode;

export const getInitialRememberableTerm: Selector<Object, void> = (state: RememberableTermState): Object =>
  state.rememberableterm.initialValues;

export const getRememberableTermList: Selector<RememberableTermList, void> = (state: RememberableTermState): RememberableTermList =>
  state.rememberableterm.list;
