// @flow
import type {RootState} from '$src/root/types';
import type {Selector} from '$src/types';
import type {ContractId} from './types';


export const getContractFilesById: Selector<Array<Object>, ContractId> = (state: RootState, id: ContractId): Array<Object> =>
  state.contractFile.byId[id];

export const getIsFetchingById: Selector<boolean, ContractId> = (state: RootState, id: ContractId): boolean =>
  state.contractFile.isFetchingById[id];
