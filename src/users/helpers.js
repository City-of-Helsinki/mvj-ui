// @flow
import type {UserList} from './types';

export const getUserFullName = (user: ?Object) => {
  if(!user) {
    return '';
  }
  return `${user.last_name ? `${user.last_name} ` : ''}${user.first_name || ''}`;
};

export const getUserOptions = (users: UserList) => {
  if(!users || !users.length) {
    return [];
  }

  return users.map((user) => {
    return {
      value: user.id.toString(),
      label: user.last_name || user.first_name
        ? `${user.last_name} ${user.first_name}`
        : user.username,
    };
  }).sort((a, b) => {
    const keyA = a.label,
      keyB = b.label;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
  });
};
