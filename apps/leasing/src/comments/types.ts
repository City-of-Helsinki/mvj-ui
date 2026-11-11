import type { LeaseId } from "@/leases/types";
import type { Attributes, Methods } from "types";
export type CommentState = {
  attributes: Attributes;
  byLease: Record<string, any>;
  isEditModeById: Record<string, any>;
  isFetching: boolean;
  isFetchingAttributes: boolean;
  isSaveClicked: boolean;
  methods: Methods;
};
export type Comment = Record<string, any>;
export type CommentList = Array<Record<string, any>>;
export type CommentListMap = Record<string, Record<string, any>>;
export type CommentId = number;
export type CreateCommentPayload = {
  lease: LeaseId;
  text: string;
  topic: number;
};
export type EditCommentPayload = {
  id: CommentId;
  text: string;
};
