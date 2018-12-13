// @flow
import type {Selector} from '$src/types';
import type {RootState} from '$src/root/types';
import type {CollectionLetterTemplates} from './types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.collectionLetterTemplate.isFetching;

export const getCollectionLetterTemplates: Selector<CollectionLetterTemplates, void> = (state: RootState): CollectionLetterTemplates =>
  state.collectionLetterTemplate.list;
