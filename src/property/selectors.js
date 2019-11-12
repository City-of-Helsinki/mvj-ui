// @flow
import get from 'lodash/get';

import type {RootState} from '$src/root/types';
import type {Selector} from '$src/types';

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isEditMode;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.lease.collapseStates, key);
};
