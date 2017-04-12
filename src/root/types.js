// @flow

import type {ApiState} from '../api/types';
import type {UserState} from '../role/types';

export type RootState = {
  api: ApiState,
  user: UserState,
};
