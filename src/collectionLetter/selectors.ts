import type { Attributes, Methods, Selector } from "types";
import type { LeaseId } from "@/leases/types";
import type { RootState } from "@/root/types";
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.collectionLetter.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.collectionLetter.methods;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.collectionLetter.isFetchingAttributes;
export const getCollectionLettersByLease: Selector<boolean, LeaseId> = (
  state: RootState,
  lease: LeaseId,
): boolean => state.collectionLetter.byLease[lease];
export const getIsFetchingByLease: Selector<boolean, LeaseId> = (
  state: RootState,
  lease: LeaseId,
): boolean => state.collectionLetter.isFetchingByLease[lease];
