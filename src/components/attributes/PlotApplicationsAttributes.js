// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchPlotApplicationsAttributes} from '$src/plotApplications/actions';
import {
  getAttributes as getPlotApplicationsAttributes,
  getIsFetchingAttributes as getIsFetchingPlotApplicationsAttributes,
  getPlotApplicationsMethods,
} from '$src/plotApplications/selectors';

import type {Attributes, Methods} from '$src/types';

function PlotApplicationsAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotApplicationsAttributes: Function,
    isFetchingPlotApplicationsAttributes: boolean,
    plotApplicationsAttributes: Attributes,
    plotApplicationsMethods: Methods,
  }

  return class PlotApplicationsAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPlotApplicationsAttributes,
        isFetchingPlotApplicationsAttributes,
        plotApplicationsAttributes,
      } = this.props;

      if(!isFetchingPlotApplicationsAttributes && !plotApplicationsAttributes) {
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
      return{
        plotApplicationsAttributes: getPlotApplicationsAttributes(state),
        isFetchingPlotApplicationsAttributes: getIsFetchingPlotApplicationsAttributes(state),
        plotApplicationsMethods: getPlotApplicationsMethods(state),
      };
    },
    {
      fetchPlotApplicationsAttributes,
    },
  ),
  PlotApplicationsAttributes,
);

export {withPlotApplicationsAttributes};
