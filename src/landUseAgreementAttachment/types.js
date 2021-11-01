// @flow
import type {Action, Attributes, Methods} from '../types';

export type LandUseAgreementAttachmentState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type CreateLandUseAgreementAttachmentPayload = {
  id: number,
  data: Object,
  file: Object,
  type: string,
}

export type DeleteLandUseAgreementAttachmentPayload = {
  id: number,
  fileId: number,
}

export type FetchAttributesAction = Action<'mvj/landUseAgreementAttachment/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/landUseAgreementAttachment/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/landUseAgreementAttachment/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/landUseAgreementAttachment/ATTRIBUTES_NOT_FOUND', void>;

export type CreateLandUseAgreementAttachmentAction = Action<'mvj/landUseAgreementAttachment/CREATE', CreateLandUseAgreementAttachmentPayload>;
export type DeleteLandUseAgreementAttachmentAction = Action<'mvj/landUseAgreementAttachment/DELETE', DeleteLandUseAgreementAttachmentPayload>;
