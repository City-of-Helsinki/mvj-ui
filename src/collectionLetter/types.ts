import type { Action, Attributes, Methods } from "src/types";
import type { LeaseId } from "src/leases/types";
export type CollectionLetterState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingByLease: Record<string, any>;
  methods: Methods;
};
export type CollectionLetterId = number;
export type UploadCollectionLetterPayload = {
  data: {
    lease: LeaseId;
  };
  file: Record<string, any>;
};
export type DeleteCollectionLetterPayload = {
  id: CollectionLetterId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<"mvj/collectionLetter/FETCH_ATTRIBUTES", void>;
export type ReceiveAttributesAction = Action<"mvj/collectionLetter/RECEIVE_ATTRIBUTES", Attributes>;
export type ReceiveMethodsAction = Action<"mvj/collectionLetter/RECEIVE_METHODS", Methods>;
export type CollectionLetterAttributesNotFoundAction = Action<"mvj/collectionLetter/ATTRIBUTES_NOT_FOUND", void>;
export type FetchCollectionLettersByLeaseAction = Action<"mvj/collectionLetter/FETCH_BY_LEASE", LeaseId>;
export type ReceiveCollectionLettersByLeaseAction = Action<"mvj/collectionLetter/RECEIVE_BY_LEASE", Record<string, any>>;
export type CollectionLettersNotFoundByLeaseAction = Action<"mvj/collectionLetter/NOT_FOUND_BY_LEASE", LeaseId>;
export type UploadCollectionLetterAction = Action<"mvj/collectionLetter/UPLOAD", UploadCollectionLetterPayload>;
export type DeleteCollectionLetterAction = Action<"mvj/collectionLetter/DELETE", DeleteCollectionLetterPayload>;