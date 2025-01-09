import type { Attributes, Selector } from "types";
import type { RootState } from "@/root/types";
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.createCollectionLetter.isFetchingAttributes;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.createCollectionLetter.attributes;
