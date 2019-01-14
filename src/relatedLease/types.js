// @flow
import type {Action, Attributes, Methods} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type RelatedLeaseState = {
  attributes: Attributes,
  isFetchingAttributes: boolean,
  methods: Methods,
};

export type CreateRelatedLeasePayload = {
  from_lease: LeaseId,
  to_lease: LeaseId,
}

export type DeleteRelatedLeasePayload = {
  id: number,
  leaseId: number,
}

export type FetchAttributesAction = Action<'mvj/relatedLease/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/relatedLease/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/relatedLease/RECEIVE_METHODS', Methods>;
export type RelatedLeaseAttributesNotFoundAction = Action<'mvj/relatedLease/ATTRIBUTES_NOT_FOUND', void>;

export type CreateRelatedLeaseAction = Action<'mvj/relatedLease/CREATE', CreateRelatedLeasePayload>;
export type DeleteRelatedLeaseAction = Action<'mvj/relatedLease/DELETE', DeleteRelatedLeasePayload>;
