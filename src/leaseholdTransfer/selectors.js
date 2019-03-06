// @flow
import type {Attributes, Methods, Selector} from '$src/types';
import type {LeaseholdTransferList} from '$src/leaseholdTransfer/types';
import type {RootState} from '$src/root/types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseholdTransfer.isFetchingAttributes;

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.leaseholdTransfer.attributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.leaseholdTransfer.methods;

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.leaseholdTransfer.isFetching;

export const getLeaseholdTransferList: Selector<LeaseholdTransferList, void> = (state: RootState): LeaseholdTransferList =>
  state.leaseholdTransfer.list;
