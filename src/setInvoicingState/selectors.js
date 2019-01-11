// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.setInvoicingState.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.setInvoicingState.attributes;

export const getMethods: Selector<Attributes, void> = (state: RootState): Methods =>
  state.setInvoicingState.methods;
