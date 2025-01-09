import { sortStringByKeyAsc } from "@/util/helpers";
import type { UserList } from "./types";

/**
 * Get user full name as string
 * @param {Object} user
 * @returns {string}
 */
export const getUserFullName = (user: Record<string, any>): string => {
  if (!user) return "";
  return user.last_name || user.first_name
    ? `${user.last_name} ${user.first_name}`.trim()
    : user.username;
};

/**
 * Get content user
 * @param {Object} user
 * @returns {Object}
 */
export const getContentUser = (
  user: Record<string, any> | null | undefined,
): Record<string, any> | null | undefined => {
  if (!user) return null;
  return {
    id: user.id,
    value: user.id,
    label: getUserFullName(user),
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

/**
 * Get user options to show on dropdowns
 * @param {Object[]} users
 * @returns {Object[]}
 */
export const getUserOptions = (users: UserList): Array<Record<string, any>> => {
  return users
    .map((user) => {
      return {
        value: user.id ? user.id.toString() : null,
        label: getUserFullName(user),
      };
    })
    .sort((a, b) => sortStringByKeyAsc(a, b, "label"));
};
