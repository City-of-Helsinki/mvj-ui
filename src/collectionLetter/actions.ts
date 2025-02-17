import { createAction } from "redux-actions";
import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
import type {
  FetchAttributesAction,
  ReceiveAttributesAction,
  ReceiveMethodsAction,
  CollectionLetterAttributesNotFoundAction,
  UploadCollectionLetterPayload,
  DeleteCollectionLetterPayload,
  FetchCollectionLettersByLeaseAction,
  ReceiveCollectionLettersByLeaseAction,
  CollectionLettersNotFoundByLeaseAction,
  UploadCollectionLetterAction,
  DeleteCollectionLetterAction,
} from "./types";
export const fetchAttributes = (): FetchAttributesAction =>
  createAction("mvj/collectionLetter/FETCH_ATTRIBUTES")();
export const receiveAttributes = (
  attributes: Attributes,
): ReceiveAttributesAction =>
  createAction("mvj/collectionLetter/RECEIVE_ATTRIBUTES")(attributes);
export const receiveMethods = (methods: Methods): ReceiveMethodsAction =>
  createAction("mvj/collectionLetter/RECEIVE_METHODS")(methods);
export const attributesNotFound =
  (): CollectionLetterAttributesNotFoundAction =>
    createAction("mvj/collectionLetter/ATTRIBUTES_NOT_FOUND")();
export const fetchCollectionLettersByLease = (
  lease: LeaseId,
): FetchCollectionLettersByLeaseAction =>
  createAction("mvj/collectionLetter/FETCH_BY_LEASE")(lease);
export const receiveCollectionLettersByLease = (
  payload: Record<string, any>,
): ReceiveCollectionLettersByLeaseAction =>
  createAction("mvj/collectionLetter/RECEIVE_BY_LEASE")(payload);
export const notFoundByLease = (
  lease: LeaseId,
): CollectionLettersNotFoundByLeaseAction =>
  createAction("mvj/collectionLetter/NOT_FOUND_BY_LEASE")(lease);
export const uploadCollectionLetter = (
  payload: UploadCollectionLetterPayload,
): UploadCollectionLetterAction =>
  createAction("mvj/collectionLetter/UPLOAD")(payload);
export const deleteCollectionLetter = (
  payload: DeleteCollectionLetterPayload,
): DeleteCollectionLetterAction =>
  createAction("mvj/collectionLetter/DELETE")(payload);
