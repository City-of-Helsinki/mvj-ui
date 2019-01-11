// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {PreviewInvoices} from './types';
import type {RootState} from '$src/root/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.previewInvoices.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.previewInvoices.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.previewInvoices.attributes;

export const getMethods: Selector<Attributes, void> = (state: RootState): Methods =>
  state.previewInvoices.methods;

export const getPreviewInvoices: Selector<PreviewInvoices, void> = (state: RootState): PreviewInvoices =>
  state.previewInvoices.list;
