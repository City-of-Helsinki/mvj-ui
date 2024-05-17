import type { Action } from "src/types";
import type { LeaseId } from "src/leases/types";
export type CreateLeaseAreaAttachmentPayload = {
  lease: LeaseId;
  data: {
    lease_area: number;
    type: string;
  };
  file: Record<string, any>;
};
export type DeleteLeaseAreaAttachmentPayload = {
  id: number;
  lease: LeaseId;
};
export type CreateLeaseAreaAttachmentAction = Action<"mvj/leaseAreaAttachment/CREATE", CreateLeaseAreaAttachmentPayload>;
export type DeleteLeaseAreaAttachmentAction = Action<"mvj/leaseAreaAttachment/DELETE", DeleteLeaseAreaAttachmentPayload>;