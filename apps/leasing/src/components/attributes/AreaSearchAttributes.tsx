import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import {
  getAttributes,
  getIsFetchingAttributes,
  getIsFetchingListAttributes,
  getListAttributes,
  getListMethods,
  getMethods,
} from "@/areaSearch/selectors";
import type { Attributes, Methods } from "types";
import { fetchAttributes, fetchListAttributes } from "@/areaSearch/actions";
import type { RootState } from "@/root/types";

function AreaSearchAttributes(WrappedComponent: React.ComponentType<any>) {
  type Props = {
    fetchAttributes: (...args: Array<any>) => any;
    fetchListAttributes: (...args: Array<any>) => any;
    areaSearchAttributes: Attributes;
    areaSearchListAttributes: Attributes;
    areaSearchMethods: Methods;
    isFetchingAttributes: boolean;
    isFetchingListAttributes: boolean;
  };
  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchAttributes,
        fetchListAttributes,
        areaSearchAttributes,
        areaSearchListAttributes,
        isFetchingAttributes,
        isFetchingListAttributes,
      } = this.props;

      if (!isFetchingAttributes && !areaSearchAttributes) {
        fetchAttributes();
      }

      if (!isFetchingListAttributes && !areaSearchListAttributes) {
        fetchListAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withAreaSearchAttributes = flowRight(
  connect(
    (state: RootState) => {
      return {
        areaSearchAttributes: getAttributes(state),
        areaSearchListAttributes: getListAttributes(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        isFetchingListAttributes: getIsFetchingListAttributes(state),
        areaSearchMethods: getMethods(state),
        areaSearchListMethods: getListMethods(state),
      };
    },
    {
      fetchAttributes,
      fetchListAttributes,
    },
  ),
  AreaSearchAttributes,
) as (arg0: React.ComponentType<any>) => React.ComponentType<any>;
export { withAreaSearchAttributes };
