import type { Attributes, Methods, Selector } from "../types";
import type { LeaseId } from "leases/types";
import type { RootState } from "root/types";
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.collectionNote.attributes;
export const getMethods: Selector<Methods, void> = (state: RootState): Methods => state.collectionNote.methods;
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.collectionNote.isFetchingAttributes;
export const getCollectionNotesByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean => state.collectionNote.byLease[lease];
export const getIsFetchingByLease: Selector<boolean, LeaseId> = (state: RootState, lease: LeaseId): boolean => state.collectionNote.isFetchingByLease[lease];