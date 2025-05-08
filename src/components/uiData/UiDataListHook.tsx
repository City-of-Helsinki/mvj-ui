import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
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
  const dispatch = useDispatch();

  const uiDataAttributes = useSelector(getUiDataAttributes);
  const uiDataMethods = useSelector(getUiDataMethods);
  const uiDataList = useSelector(getUiDataList);
  const isFetchingUiDataAttributes = useSelector(getIsFetchingUiDataAttributes);
  const isFetchingUiDataList = useSelector(getIsFetching);

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
