// @flow
import type {Action} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type CreateLeaseInspectionAttachmentPayload = {
  lease: LeaseId,
  data: {
    inspection: number,
  },
  file: Object,
}

export type DeleteLeaseInspectionAttachmentPayload = {
  id: number,
  lease: LeaseId,
}

export type CreateLeaseInspectionAttachmentAction = Action<'mvj/leaseInspectionAttachment/CREATE', CreateLeaseInspectionAttachmentPayload>;
export type DeleteLeaseInspectionAttachmentAction = Action<'mvj/leaseInspectionAttachment/DELETE', DeleteLeaseInspectionAttachmentPayload>;
