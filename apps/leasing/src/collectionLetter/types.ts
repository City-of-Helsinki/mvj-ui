import type { Attributes, Methods } from "types";
import type { LeaseId } from "@/leases/types";
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
