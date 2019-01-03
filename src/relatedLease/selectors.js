// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.relatedLease.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.relatedLease.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.relatedLease.isFetchingAttributes;
