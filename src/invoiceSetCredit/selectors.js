// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.invoiceSetCredit.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.invoiceSetCredit.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.invoiceSetCredit.methods;
