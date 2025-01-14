import type { Attributes, Methods, Selector } from "types";
import type { RootState } from "@/root/types";
import type { CommentId, CommentList } from "./types";
import type { LeaseId } from "@/leases/types";
export const getEditModeFlags: Selector<Record<string, any>, void> = (
  state: RootState,
): Record<string, any> => state.comment.isEditModeById;
export const getIsEditModeById: Selector<boolean, CommentId> = (
  state: RootState,
  commentId: CommentId,
): boolean => state.comment.isEditModeById[commentId];
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.comment.isFetching;
export const getIsFetchingAttributes: Selector<boolean, void> = (
  state: RootState,
): boolean => state.comment.isFetchingAttributes;
export const getIsSaveClicked: Selector<boolean, void> = (
  state: RootState,
): boolean => state.comment.isSaveClicked;
export const getAttributes: Selector<Attributes, void> = (
  state: RootState,
): Attributes => state.comment.attributes;
export const getMethods: Selector<Methods, void> = (
  state: RootState,
): Methods => state.comment.methods;
export const getCommentsByLease: Selector<CommentList, LeaseId> = (
  state: RootState,
  leaseId: LeaseId,
): CommentList => state.comment.byLease[leaseId];
