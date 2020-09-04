// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Attributes, Selector, Methods} from '../types';
import type {RootState} from '$src/root/types';

import type {
  PlotSearch,
  PlotSearchList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.plotSearch.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isEditMode;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.plotSearch.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.plotSearch.isFormValidById[id];

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isSaveClicked;

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.plotSearch.isFormValidById;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.plotSearch.isFetchingAttributes;

export const getCurrentPlotSearch: Selector<PlotSearch, void> = (state: RootState): PlotSearch =>
  state.plotSearch.current;

export const getPlotSearchList: Selector<PlotSearchList, void> = (state: RootState): PlotSearchList =>
  state.plotSearch.list;

export const getErrorsByFormName: Selector<?Object, string> = (state: RootState, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};

export const getPlotSearchMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.plotSearch.methods;
