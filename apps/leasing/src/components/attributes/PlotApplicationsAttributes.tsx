import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import type { Attributes, Methods } from "types";
import { fetchAttributes as fetchPlotApplicationsAttributes } from "@/application/actions";
import {
  getAttributes as getPlotApplicationsAttributes,
  getIsFetchingAttributes as getIsFetchingPlotApplicationsAttributes,
  getMethods,
} from "@/application/selectors";

function PlotApplicationsAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotApplicationsAttributes: (...args: Array<any>) => any;
    isFetchingPlotApplicationsAttributes: boolean;
    plotApplicationsAttributes: Attributes;
    plotApplicationsMethods: Methods;
  };
  return class PlotApplicationsAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPlotApplicationsAttributes,
        isFetchingPlotApplicationsAttributes,
        plotApplicationsAttributes,
      } = this.props;

      if (
        !isFetchingPlotApplicationsAttributes &&
        !plotApplicationsAttributes
      ) {
        fetchPlotApplicationsAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withPlotApplicationsAttributes = flowRight(
  connect(
    (state) => {
      return {
        plotApplicationsAttributes: getPlotApplicationsAttributes(state),
        isFetchingPlotApplicationsAttributes:
          getIsFetchingPlotApplicationsAttributes(state),
        plotApplicationsMethods: getMethods(state),
      };
    },
    {
      fetchPlotApplicationsAttributes,
    },
  ),
  PlotApplicationsAttributes,
);
export { withPlotApplicationsAttributes };
