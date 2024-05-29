import type { Action } from "types";
import type { LeaseId } from "leases/types";
export type CreateLeaseInspectionAttachmentPayload = {
  lease: LeaseId;
  data: {
    inspection: number;
  };
  file: any;
};
export type DeleteLeaseInspectionAttachmentPayload = {
  id: number;
  lease: LeaseId;
};
export type CreateLeaseInspectionAttachmentAction = Action<string, CreateLeaseInspectionAttachmentPayload>;
export type DeleteLeaseInspectionAttachmentAction = Action<string, DeleteLeaseInspectionAttachmentPayload>;