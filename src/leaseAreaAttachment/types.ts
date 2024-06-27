import type { Action } from "types";
import type { LeaseId } from "/src/leases/types";
export type CreateLeaseAreaAttachmentPayload = {
  lease: LeaseId;
  data: {
    lease_area: number;
    type: string;
  };
  file: any;
};
export type DeleteLeaseAreaAttachmentPayload = {
  id: number;
  lease: LeaseId;
};
export type CreateLeaseAreaAttachmentAction = Action<string, CreateLeaseAreaAttachmentPayload>;
export type DeleteLeaseAreaAttachmentAction = Action<string, DeleteLeaseAreaAttachmentPayload>;