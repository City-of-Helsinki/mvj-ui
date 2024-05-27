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
  file: any;
};
export type DeleteCollectionLetterPayload = {
  id: CollectionLetterId;
  lease: LeaseId;
};
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type CollectionLetterAttributesNotFoundAction = Action<string, void>;
export type FetchCollectionLettersByLeaseAction = Action<string, LeaseId>;
export type ReceiveCollectionLettersByLeaseAction = Action<string, Record<string, any>>;
export type CollectionLettersNotFoundByLeaseAction = Action<string, LeaseId>;
export type UploadCollectionLetterAction = Action<string, UploadCollectionLetterPayload>;
export type DeleteCollectionLetterAction = Action<string, DeleteCollectionLetterPayload>;