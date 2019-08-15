// @flow
import get from 'lodash/get';

import {getContentUser} from '$src/users/helpers';

/**
 * Get content comments
 * @param {Object[]} comments
 * @returns {Object[]}
 */
export const getContentComments = (comments: Array<Object>): Array<Object> => {
  if(!comments) {return [];}

  return comments.map((comment) => {
    return {
      id: comment.id,
      created_at: comment.created_at,
      modified_at: comment.modified_at,
      is_archived: comment.is_archived,
      text: comment.text,
      topic: get(comment, 'topic.id') || comment.topic,
      user: getContentUser(comment.user),
      lease: comment.lease,
    };
  });
};

/**
 * Get comment payload
 * @param {Object} comment
 * @returns {Object}
 */
export const getPayloadComment = (comment: Object) => ({
  id: comment.id,
  text: comment.text,
});
