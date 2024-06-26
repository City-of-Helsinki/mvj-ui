import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchPlotSearchAttributes, fetchPlotSearchSubtypes } from "plotSearch/actions";
import { getAttributes as getPlotSearchAttributes, getIsFetchingAttributes as getIsFetchingPlotSearchAttributes, getPlotSearchMethods, getPlotSearchSubTypes, getIsFetching } from "plotSearch/selectors";
import { getFormAttributes, getIsFetchingFormAttributes } from "/src/application/selectors";
import { fetchFormAttributes } from "/src/application/actions";
import type { Attributes, Methods } from "types";

function PlotSearchAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotSearchAttributes: (...args: Array<any>) => any;
    fetchPlotSearchSubtypes: (...args: Array<any>) => any;
    fetchFormAttributes: (...args: Array<any>) => any;
    isFetchingPlotSearchAttributes: boolean;
    isFetching: boolean;
    formAttributes: Attributes;
    isFetchingFormAttributes: boolean;
    plotSearchAttributes: Attributes;
    plotSearchMethods: Methods;
    plotSearchSubTypes: Record<string, any>;
  };
  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPlotSearchAttributes,
        isFetchingPlotSearchAttributes,
        plotSearchAttributes,
        fetchPlotSearchSubtypes,
        plotSearchSubTypes,
        isFetching
      } = this.props;

      if (!isFetchingPlotSearchAttributes && !plotSearchAttributes) {
        fetchPlotSearchAttributes();
      }

      if (!isFetching && !plotSearchSubTypes) {
        fetchPlotSearchSubtypes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withPlotSearchAttributes = (flowRight(connect(state => {
  return {
    plotSearchAttributes: getPlotSearchAttributes(state),
    isFetchingPlotSearchAttributes: getIsFetchingPlotSearchAttributes(state),
    plotSearchMethods: getPlotSearchMethods(state),
    plotSearchSubTypes: getPlotSearchSubTypes(state),
    isFetching: getIsFetching(state),
    isFetchingFormAttributes: getIsFetchingFormAttributes(state),
    formAttributes: getFormAttributes(state)
  };
}, {
  fetchPlotSearchAttributes,
  fetchPlotSearchSubtypes,
  fetchFormAttributes
}), PlotSearchAttributes) as (arg0: React.ComponentType<any>) => React.ComponentType<any>);
export { withPlotSearchAttributes };