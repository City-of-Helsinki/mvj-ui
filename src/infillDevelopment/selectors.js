// @flow
import get from 'lodash/get';

import type {Attributes, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {InfillDevelopment, InfillDevelopmentList} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.infillDevelopment.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.infillDevelopment.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.infillDevelopment.isFetching;

export const getInfillDevelopments: Selector<InfillDevelopmentList, void> = (state: RootState): InfillDevelopmentList =>
  state.infillDevelopment.list;

export const getCurrentInfillDevelopment: Selector<InfillDevelopment, void> = (state: RootState): InfillDevelopment =>
  state.infillDevelopment.current;

export const getFormInitialValues: Selector<InfillDevelopment, void> = (state: RootState): InfillDevelopment =>
  state.infillDevelopment.initialValues;

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.infillDevelopment.isSaveClicked;

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.infillDevelopment.isFormValidById[id];

export const getCollapseStateByKey: Selector<?Object, string> = (state: Object, key: string): ?Object => {
  return get(state.infillDevelopment.collapseStates, key);
};
