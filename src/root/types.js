// @flow

import type {ApiState} from '../api/types';
import type {AuthState} from '../auth/types';
import type {CollectionLetterState} from '$src/collectionLetter/types';
import type {UserState} from '../role/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  collectionLetter: CollectionLetterState,
  user: UserState,
};
