import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { CreateCommentPayload, EditCommentPayload } from "./types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl("comment/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchComments = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`comment/${search || ""}`)));
};
export const createComment = (
  comment: CreateCommentPayload,
): Generator<any, any, any> => {
  const body = JSON.stringify(comment);
  return callApi(
    new Request(createUrl(`comment/`), {
      method: "POST",
      body,
    }),
  );
};
export const editComment = (
  comment: EditCommentPayload,
): Generator<any, any, any> => {
  const { id } = comment;
  const body = JSON.stringify(comment);
  return callApi(
    new Request(createUrl(`comment/${id}/`), {
      method: "PATCH",
      body,
    }),
  );
};
