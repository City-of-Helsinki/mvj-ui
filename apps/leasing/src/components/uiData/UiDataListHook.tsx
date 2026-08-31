import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import { isEmpty } from "lodash-es";
import {
  fetchUiDataList,
  fetchAttributes as fetchUiDataAttributes,
} from "@/uiData/actions";
import {
  getAttributes as getUiDataAttributes,
  getIsFetching,
  getIsFetchingAttributes as getIsFetchingUiDataAttributes,
  getMethods as getUiDataMethods,
  getUiDataList,
} from "@/uiData/selectors";

export function useUiDataList() {
  const dispatch = useAppDispatch();

  const uiDataAttributes = useAppSelector(getUiDataAttributes);
  const uiDataMethods = useAppSelector(getUiDataMethods);
  const uiDataList = useAppSelector(getUiDataList);
  const isFetchingUiDataAttributes = useAppSelector(
    getIsFetchingUiDataAttributes,
  );
  const isFetchingUiDataList = useAppSelector(getIsFetching);

  useEffect(() => {
    if (!isFetchingUiDataAttributes && !uiDataAttributes && !uiDataMethods) {
      dispatch(fetchUiDataAttributes());
    }

    if (!isFetchingUiDataList && isEmpty(uiDataList)) {
      dispatch(
        fetchUiDataList({
          limit: 100000,
        }),
      );
    }
  }, [
    dispatch,
    isFetchingUiDataAttributes,
    isFetchingUiDataList,
    uiDataAttributes,
    uiDataList,
    uiDataMethods,
  ]);

  return {
    uiDataAttributes,
    uiDataMethods,
    uiDataList,
    isFetchingUiDataAttributes,
    isFetchingUiDataList,
  };
}
