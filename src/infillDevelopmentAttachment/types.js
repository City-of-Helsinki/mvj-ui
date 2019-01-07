// @flow
import type {Action, Attributes, Methods} from '../types';
import type {InfillDevelopmentId} from '$src/infillDevelopment/types';

export type InfillDevelopmentAttachmentState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
}

export type CreateInfillDevelopmentAttachmentPayload = {
  id: InfillDevelopmentId,
  data: Object,
  file: Object,
}

export type DeleteInfillDevelopmentAttachmentPayload = {
  id: InfillDevelopmentId,
  fileId: number,
}

export type FetchAttributesAction = Action<'mvj/infillDevelopmentAttachment/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/infillDevelopmentAttachment/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/infillDevelopmentAttachment/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/infillDevelopmentAttachment/ATTRIBUTES_NOT_FOUND', void>;

export type CreateInfillDevelopmentAttachmentAction = Action<'mvj/infillDevelopmentAttachment/CREATE', CreateInfillDevelopmentAttachmentPayload>;
export type DeleteInfillDevelopmentAttachmentAction = Action<'mvj/infillDevelopmentAttachment/DELETE', DeleteInfillDevelopmentAttachmentPayload>;
