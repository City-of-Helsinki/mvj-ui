// @flow
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import type {Attributes, Selector} from '../types';
import type {RootState} from '$src/root/types';

import type {
  Property,
  PropertyList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.property.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isEditMode;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.property.collapseStates, key);
};

export const getIsFormValidById: Selector<boolean, string> = (state: RootState, id: string): boolean =>
  state.property.isFormValidById[id];

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isSaveClicked;

export const getIsFormValidFlags: Selector<Object, void> = (state: RootState): Object =>
  state.property.isFormValidById;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isFetchingAttributes;

export const getCurrentProperty: Selector<Property, void> = (state: RootState): Property =>
  state.property.current;

export const getPropertyList: Selector<PropertyList, void> = (state: RootState): PropertyList =>
  state.property.list;

export const getErrorsByFormName: Selector<?Object, string> = (state: RootState, formName: string): ?Object => {
  const form = state.form[formName];
  if(!isEmpty(form)) {
    return form.syncErrors;
  }
  return null;
};
