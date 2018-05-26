// @flow
import type {Selector} from '../types';
import type {RememberableTermList, RememberableTermState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RememberableTermState): boolean =>
  state.rememberableTerm.isFetching;

export const getIsEditMode: Selector<boolean, void> = (state: RememberableTermState): boolean =>
  state.rememberableTerm.isEditMode;

export const getInitialRememberableTerm: Selector<Object, void> = (state: RememberableTermState): Object =>
  state.rememberableTerm.initialValues;

export const getRememberableTermList: Selector<RememberableTermList, void> = (state: RememberableTermState): RememberableTermList =>
  state.rememberableTerm.list;
