// @flow 
import {getContactFullName} from '$src/contacts/helpers';

/**
 * Get content lessor
 * @params {Object} lessor
 * @returns {Object}
 */
export const getContentLessor = (lessor: ?Object): Object => {
  if(!lessor) return null;

  return {
    id: lessor.id,
    value: lessor.id,
    label: getContactFullName(lessor),
    type: lessor.type,
    first_name: lessor.first_name,
    last_name: lessor.last_name,
    name: lessor.name,
  };
};
