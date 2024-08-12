import get from "lodash/get";
import { getContentUser } from "@/users/helpers";

/**
 * Get content comments
 * @param {Object[]} comments
 * @returns {Object[]}
 */
export const getContentComments = (comments: Array<Record<string, any>>): Array<Record<string, any>> => {
  if (!comments) {
    return [];
  }

  return comments.map(comment => {
    return {
      id: comment.id,
      created_at: comment.created_at,
      modified_at: comment.modified_at,
      is_archived: comment.is_archived,
      text: comment.text,
      topic: get(comment, 'topic.id') || comment.topic,
      user: getContentUser(comment.user),
      lease: comment.lease
    };
  });
};

/**
 * Get comment payload
 * @param {Object} comment
 * @returns {Object}
 */
export const getPayloadComment = (comment: Record<string, any>) => ({
  id: comment.id,
  text: comment.text
});