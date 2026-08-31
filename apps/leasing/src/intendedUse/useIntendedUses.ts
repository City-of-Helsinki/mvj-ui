import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { fetchIntendedUse } from "./actions";
import { getIntendedUseList, getIsFetching } from "./selectors";
import type { IntendedUseList } from "./types";

export const useIntendedUses = (): {
  intendedUseList: IntendedUseList;
  isFetchingIntendedUses: boolean;
} => {
  const dispatch = useAppDispatch();
  const intendedUseList = useAppSelector(getIntendedUseList);
  const isFetchingIntendedUses = useAppSelector(getIsFetching);

  useEffect(() => {
    // Only fetch if we don't have data and aren't already fetching
    if (!intendedUseList.length && !isFetchingIntendedUses) {
      dispatch(fetchIntendedUse());
    }
  }, [dispatch, intendedUseList.length, isFetchingIntendedUses]);

  return {
    intendedUseList,
    isFetchingIntendedUses,
  };
};
