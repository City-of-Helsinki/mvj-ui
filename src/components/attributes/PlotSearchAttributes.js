// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {
  fetchAttributes as fetchPlotSearchAttributes,
  fetchPlotSearchSubtypes,
} from '$src/plotSearch/actions';
import {
  getAttributes as getPlotSearchAttributes,
  getIsFetchingAttributes as getIsFetchingPlotSearchAttributes,
  getPlotSearchMethods,
  getPlotSearchSubTypes,
  getIsFetching,
} from '$src/plotSearch/selectors';

import type {Attributes, Methods} from '$src/types';

function PlotSearchAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotSearchAttributes: Function,
    fetchPlotSearchSubtypes: Function,
    isFetchingPlotSearchAttributes: boolean,
    isFetching: boolean,
    plotSearchAttributes: Attributes,
    plotSearchMethods: Methods,
    plotSearchSubTypes: Object,
  }

  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPlotSearchAttributes,
        isFetchingPlotSearchAttributes,
        plotSearchAttributes,
        fetchPlotSearchSubtypes,
        plotSearchSubTypes,
        isFetching,
      } = this.props;

      if(!isFetchingPlotSearchAttributes && !plotSearchAttributes) {
        fetchPlotSearchAttributes();
      }
      if(!isFetching && !plotSearchSubTypes) {
        fetchPlotSearchSubtypes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withPlotSearchAttributes = flowRight(
  connect(
    (state) => {
      return{
        plotSearchAttributes: getPlotSearchAttributes(state),
        isFetchingPlotSearchAttributes: getIsFetchingPlotSearchAttributes(state),
        plotSearchMethods: getPlotSearchMethods(state),
        plotSearchSubTypes: getPlotSearchSubTypes(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchPlotSearchAttributes,
      fetchPlotSearchSubtypes,
    },
  ),
  PlotSearchAttributes,
);

export {withPlotSearchAttributes};
