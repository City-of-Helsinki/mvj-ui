import type { Selector } from "types";
import type { RootState } from "@/root/types";
import type { UserList } from "./types";
export const getIsFetching: Selector<boolean, void> = (
  state: RootState,
): boolean => state.user.isFetching;
export const getUsers: Selector<UserList, void> = (
  state: RootState,
): UserList => state.user.list;
