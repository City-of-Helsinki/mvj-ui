// @flow

/**
* Get payload to patch comment
* @param comment
* @returns {Object}
*/

export const getCommentPatchPayload = (comment: Object) => ({
  id: comment.id,
  text: comment.text,
});
