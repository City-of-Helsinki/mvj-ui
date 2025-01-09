import type { Action, Attributes } from "@/types";
export type CreateCollectionLetterState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type AttributesNotFoundAction = Action<string, void>;
