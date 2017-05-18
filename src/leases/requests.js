// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

// import type {Identifiers} from './types';

export const fetchIdentifiers = () => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};
