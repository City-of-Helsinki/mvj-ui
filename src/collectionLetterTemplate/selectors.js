// @flow
import type {Selector} from '../types';

import type {CollectionLetterTemplateState} from './types';

export const getIsFetching: Selector<boolean, void> = (state: CollectionLetterTemplateState): boolean =>
  state.collectionLetterTemplate.isFetching;

export const getCollectionLetterTemplates: Selector<boolean, void> = (state: CollectionLetterTemplateState): boolean =>
  state.collectionLetterTemplate.list;
