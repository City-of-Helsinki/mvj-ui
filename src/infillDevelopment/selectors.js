// @flow
import type {Selector} from '../types';
import type {
  Attributes,
  InfillDevelopment,
  InfillDevelopmentList,
  InfillDevelopmentState,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: InfillDevelopmentState): Attributes =>
  state.infillDevelopment.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: InfillDevelopmentState): boolean =>
  state.infillDevelopment.isEditMode;

export const getIsFetching: Selector<boolean, void> = (state: InfillDevelopmentState): boolean =>
  state.infillDevelopment.isFetching;

export const getInfillDevelopments: Selector<InfillDevelopmentList, void> = (state: InfillDevelopmentState): InfillDevelopmentList =>
  state.infillDevelopment.list;

export const getCurrentInfillDevelopment: Selector<InfillDevelopment, void> = (state: InfillDevelopmentState): InfillDevelopment =>
  state.infillDevelopment.current;

export const getFormInitialValues: Selector<InfillDevelopment, void> = (state: InfillDevelopmentState): InfillDevelopment =>
  state.infillDevelopment.initialValues;

export const getIsSaveClicked: Selector<boolean, void> = (state: InfillDevelopmentState): boolean =>
  state.infillDevelopment.isSaveClicked;

export const getIsFormValidById: Selector<boolean, string> = (state: InfillDevelopmentState, id: string): boolean =>
  state.infillDevelopment.isFormValidById[id];
