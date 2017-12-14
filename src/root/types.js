// @flow

import type {ApiState} from '../api/types';
import type {AuthState} from '../auth/types';
import type {UserState} from '../role/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  user: UserState,
};
