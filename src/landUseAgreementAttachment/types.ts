import type { Action, Attributes, Methods } from "@/types";
export type LandUseAgreementAttachmentState = {
  attributes: Attributes;
  isFetchingAttributes: boolean;
  methods: Methods;
};
export type CreateLandUseAgreementAttachmentPayload = {
  id: number;
  data: Record<string, any>;
  file: any;
  type: string;
};
export type DeleteLandUseAgreementAttachmentPayload = {
  id: number;
  fileId: number;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type CreateLandUseAgreementAttachmentAction = Action<
  string,
  CreateLandUseAgreementAttachmentPayload
>;
export type DeleteLandUseAgreementAttachmentAction = Action<
  string,
  DeleteLandUseAgreementAttachmentPayload
>;
