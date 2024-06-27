import type { Action, Attributes, Methods } from "../types";
import type { InfillDevelopmentId } from "/src/infillDevelopment/types";
export type InfillDevelopmentAttachmentState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
  methods: Methods;
};
export type CreateInfillDevelopmentAttachmentPayload = {
  id: InfillDevelopmentId;
  data: Record<string, any>;
  file: any;
};
export type DeleteInfillDevelopmentAttachmentPayload = {
  id: InfillDevelopmentId;
  fileId: number;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type CreateInfillDevelopmentAttachmentAction = Action<string, CreateInfillDevelopmentAttachmentPayload>;
export type DeleteInfillDevelopmentAttachmentAction = Action<string, DeleteInfillDevelopmentAttachmentPayload>;