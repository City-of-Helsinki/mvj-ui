// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {CollectionLetterTemplates} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.collectionLetterTemplate.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.collectionLetterTemplate.methods;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.collectionLetterTemplate.isFetchingAttributes;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.collectionLetterTemplate.isFetching;

export const getCollectionLetterTemplates: Selector<CollectionLetterTemplates, void> = (state: RootState): CollectionLetterTemplates =>
  state.collectionLetterTemplate.list;
