// @flow
import type {RootState} from '$src/root/types';
import type {Methods, Selector} from '$src/types';
import type {
  ContractId,
} from './types';

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.contractFile.isFetchingAttributes;

export const getMethods: Selector<Methods, void> = (state: RootState): Methods =>
  state.contractFile.methods;

export const getContractFilesById: Selector<Array<Object>, ContractId> = (state: RootState, id: ContractId): Array<Object> =>
  state.contractFile.byId[id];

export const getIsFetchingById: Selector<boolean, ContractId> = (state: RootState, id: ContractId): boolean =>
  state.contractFile.isFetchingById[id];
