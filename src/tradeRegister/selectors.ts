import type { RootState } from "/src/root/types";
import type { Selector } from "types";
export const getIsFetchingCompanyExtendedById: Selector<boolean, string> = (state: RootState, businessId: string): boolean => state.tradeRegister.isFetchingCompanyExtendedById[businessId];
export const getCompanyExtendedById: Selector<Record<string, any> | null | undefined, string> = (state: RootState, businessId: string): Record<string, any> | null | undefined => state.tradeRegister.companyExtendedById[businessId];
export const getIsFetchingCompanyNoticeById: Selector<boolean, string> = (state: RootState, businessId: string): boolean => state.tradeRegister.isFetchingCompanyNoticeById[businessId];
export const getCompanyNoticeById: Selector<Record<string, any> | null | undefined, string> = (state: RootState, businessId: string): Record<string, any> | null | undefined => state.tradeRegister.companyNoticeById[businessId];
export const getIsFetchingCompanyRepresentById: Selector<boolean, string> = (state: RootState, businessId: string): boolean => state.tradeRegister.isFetchingCompanyRepresentById[businessId];
export const getCompanyRepresentById: Selector<Record<string, any> | null | undefined, string> = (state: RootState, businessId: string): Record<string, any> | null | undefined => state.tradeRegister.companyRepresentById[businessId];
export const getCollapseStateByKey: Selector<boolean, string> = (state: RootState, key: string): boolean => state.tradeRegister.collapseStates[key];