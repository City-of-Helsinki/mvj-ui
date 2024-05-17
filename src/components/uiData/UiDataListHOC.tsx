import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { fetchAttributes as fetchUiDataAttributes, fetchUiDataList } from "src/uiData/actions";
import { getAttributes as getUiDataAttributes, getIsFetching, getIsFetchingAttributes as getIsFetchingUiDataAttributes, getMethods as getUiDataMethods, getUiDataList } from "src/uiData/selectors";
import type { Attributes, Methods } from "src/types";
import type { UiDataList } from "src/uiData/types";

function UiDataListHOC(WrappedComponent: any) {
  type Props = {
    fetchUiDataAttributes: (...args: Array<any>) => any;
    fetchUiDataList: (...args: Array<any>) => any;
    isFetchingUiDataAttributes: boolean;
    isFetchingUiDataList: boolean;
    uiDataAttributes: Attributes;
    uiDataList: UiDataList;
    uiDataMethods: Methods;
  };
  return class UiDataListHOC extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchUiDataAttributes,
        fetchUiDataList,
        isFetchingUiDataAttributes,
        isFetchingUiDataList,
        uiDataAttributes,
        uiDataList,
        uiDataMethods
      } = this.props;

      if (!isFetchingUiDataAttributes && !uiDataAttributes && !uiDataMethods) {
        fetchUiDataAttributes();
      }

      if (!isFetchingUiDataList && isEmpty(uiDataList)) {
        fetchUiDataList({
          limit: 100000
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

// @ts-expect-error
const withUiDataList = flowRight(connect(state => {
  return {
    isFetchingUiDataAttributes: getIsFetchingUiDataAttributes(state),
    isFetchingUiDataList: getIsFetching(state),
    uiDataAttributes: getUiDataAttributes(state),
    uiDataList: getUiDataList(state),
    uiDataMethods: getUiDataMethods(state)
  };
}, {
  fetchUiDataAttributes,
  fetchUiDataList
}), UiDataListHOC);
export { withUiDataList };