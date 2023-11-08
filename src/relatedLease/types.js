// @flow
import type {Action} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type CreateRelatedLeasePayload = {
  from_lease: LeaseId,
  to_lease: LeaseId,
}

export type DeleteRelatedLeasePayload = {
  id: number,
  leaseId: number,
}

export type CreateRelatedPlotApplicationPayload = {
  object_id: number,
  content_type_model: number,
  lease: number,
}

export type DeleteRelatedPlotApplicationPayload = {
  id: number,
  leaseId: number,
}

export type CreateRelatedLeaseAction = Action<'mvj/relatedLease/CREATE', CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<'mvj/relatedLease/DELETE', DeleteRelatedLeasePayload>;
export type CreateRelatedPlotApplicationAction = Action<'mvj/relatedLease/CREATE_PLOT_APPLICATION', CreateRelatedPlotApplicationPayload>;
export type DeleteRelatedPlotApplicationAction = Action<'mvj/relatedLease/DELETE_PLOT_APPLICATION', DeleteRelatedPlotApplicationPayload>;
