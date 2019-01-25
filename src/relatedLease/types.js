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

export type CreateRelatedLeaseAction = Action<'mvj/relatedLease/CREATE', CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<'mvj/relatedLease/DELETE', DeleteRelatedLeasePayload>;
