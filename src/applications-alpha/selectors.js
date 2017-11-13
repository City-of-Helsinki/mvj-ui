// @flow

import type {Selector} from '../types';
import type {Application, ApplicationState} from './types';

export const getIsFetching: Selector<Application, void> = (state: Object): ApplicationState =>
  state.applications.isFetching;

export const getApplicationsList: Selector<Application, void> = (state: Object): ApplicationState =>
  state.applications.list;

export const getCurrentApplication: Selector<Application, void> = (state: Object): ApplicationState =>
  state.applications.current;
