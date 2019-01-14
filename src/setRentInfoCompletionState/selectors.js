// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.setRentInfoCompletionState.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.setRentInfoCompletionState.attributes;

export const getMethods: Selector<Attributes, void> = (state: RootState): Methods =>
  state.setRentInfoCompletionState.methods;
