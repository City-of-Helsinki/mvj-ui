import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "/src/root/types";
export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes => state.infillDevelopmentAttachment.attributes;
export const getMethods: Selector<Methods, void> = (state: RootState): Methods => state.infillDevelopmentAttachment.methods;
export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean => state.infillDevelopmentAttachment.isFetchingAttributes;