// @flow
import type {Action} from '$src/types';
import type {LeaseId} from '$src/leases/types';

export type CollectionCourtDecisionState = {
  byLease: Object,
  isFetchingByLease: Object,
};
export type CollectionCourtDecisionId = number;
export type UploadCollectionCourtDecisionPayload = {
  data: {
    lease: LeaseId,
  },
  file: Object,
};
export type DeleteCollectionCourtDecisionPayload = {
  id: CollectionCourtDecisionId,
  lease: LeaseId,
};

export type FetchCollectionCourtDecisionsByLeaseAction = Action<'mvj/collectionCourtDecision/FETCH_BY_LEASE', LeaseId>;
export type ReceiveCollectionCourtDecisionsByLeaseAction = Action<'mvj/collectionCourtDecision/RECEIVE_BY_LEASE', Object>;
export type CollectionCourtDecisionsNotFoundByLeaseAction = Action<'mvj/collectionCourtDecision/NOT_FOUND_BY_LEASE', LeaseId>;
export type UploadCollectionCourtDecisionAction = Action<'mvj/collectionCourtDecision/UPLOAD', UploadCollectionCourtDecisionPayload>;
export type DeleteCollectionCourtDecisionAction = Action<'mvj/collectionCourtDecision/DELETE', DeleteCollectionCourtDecisionPayload>;
