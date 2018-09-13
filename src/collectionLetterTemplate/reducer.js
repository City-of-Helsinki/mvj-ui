// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import type {Reducer} from '../types';
import type {
  CollectionLetterTemplates,
  ReceiveCollectionLetterTemplatesAction,
} from './types';

const isFetchingReducer: Reducer<boolean> = handleActions({
  'mvj/collectionLetterTemplate/FETCH_ALL': () => true,
  'mvj/collectionLetterTemplate/NOT_FOUND': () => false,
  'mvj/collectionLetterTemplate/RECEIVE_ALL': () => false,
}, false);

const collectionLetterTemplatesReducer: Reducer<CollectionLetterTemplates> = handleActions({
  ['mvj/collectionLetterTemplate/RECEIVE_ALL']: (state: CollectionLetterTemplates, {payload: templates}: ReceiveCollectionLetterTemplatesAction) => {
    return templates;
  },
}, []);

export default combineReducers({
  isFetching: isFetchingReducer,
  list: collectionLetterTemplatesReducer,
});
