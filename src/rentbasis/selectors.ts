import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { RentBasis, RentBasisList } from "./types";
export const getIsEditMode: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isEditMode;
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isFetching;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isFetchingAttributes;
export const getIsSaveClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isSaveClicked;
export const getIsSaving: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isSaving;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.rentBasis.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.rentBasis.methods;
export const getRentBasisList: Selector<RentBasisList, void> = (
  state: RootState,
): RentBasisList => state.rentBasis.list;
export const getRentBasis: Selector<RentBasis, void> = (
  state: RootState,
): RentBasis => state.rentBasis.rentbasis;
export const getRentBasisInitialValues: Selector<RentBasis, void> = (
  state: RootState,
): RentBasis => state.rentBasis.initialValues;
export const getIsFormValid: Selector<boolean, void> = (
  state: RootState,
): boolean => state.rentBasis.isFormValid;
