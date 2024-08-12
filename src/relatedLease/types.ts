import type { Action } from "types";
import type { LeaseId } from "@/leases/types";
export type CreateRelatedLeasePayload = {
  from_lease: LeaseId;
  to_lease: LeaseId;
};
export type DeleteRelatedLeasePayload = {
  id: number;
  leaseId: number;
};
export type CreateRelatedPlotApplicationPayload = {
  object_id: number;
  content_type_model: number;
  lease: number;
};
export type DeleteRelatedPlotApplicationPayload = {
  id: number;
  leaseId: number;
};
export type CreateRelatedLeaseAction = Action<string, CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<string, DeleteRelatedLeasePayload>;
export type CreateRelatedPlotApplicationAction = Action<string, CreateRelatedPlotApplicationPayload>;
export type DeleteRelatedPlotApplicationAction = Action<string, DeleteRelatedPlotApplicationPayload>;