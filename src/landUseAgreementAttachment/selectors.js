// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.landUseAgreementAttachment.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods => 
  state.landUseAgreementAttachment.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.landUseAgreementAttachment.isFetchingAttributes;
