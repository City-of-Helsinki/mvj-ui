// @flow
import type {RootState} from '$src/root/types';
import type {Selector} from '$src/types';

export const getIsFetchingCompanyExtendedById: Selector<boolean, string> = (state: RootState, businessId: string): boolean =>
  state.tradeRegister.isFetchingCompanyExtendedById[businessId];

export const getCompanyExtendedById: Selector<?Object, string> = (state: RootState, businessId: string): ?Object =>
  state.tradeRegister.companyExtendedById[businessId];

export const getCollapseStateByKey: Selector<boolean, string> = (state: RootState, key: string): boolean =>
  state.tradeRegister.collapseStates[key];
