// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {
  fetchAttributes as fetchPlotSearchAttributes,
  fetchPlotSearchSubtypes,
  fetchFormAttributes,
} from '$src/plotSearch/actions';
import {
  getAttributes as getPlotSearchAttributes,
  getIsFetchingAttributes as getIsFetchingPlotSearchAttributes,
  getPlotSearchMethods,
  getPlotSearchSubTypes,
  getIsFetching,
  getIsFetchingFormAttributes,
  getFormAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes, Methods} from '$src/types';

function PlotSearchAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotSearchAttributes: Function,
    fetchPlotSearchSubtypes: Function,
    fetchFormAttributes: Function,
    isFetchingPlotSearchAttributes: boolean,
    isFetching: boolean,
    formAttributes: Attributes,
    isFetchingFormAttributes: boolean,
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
        isFetchingFormAttributes,
        formAttributes,
        fetchFormAttributes,
      } = this.props;

      if(!isFetchingPlotSearchAttributes && !plotSearchAttributes) {
        fetchPlotSearchAttributes();
      }
      if(!isFetching && !plotSearchSubTypes) {
        fetchPlotSearchSubtypes();
      }
      if(!isFetchingFormAttributes && !formAttributes) {
        fetchFormAttributes();
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
        isFetchingFormAttributes: getIsFetchingFormAttributes(state),
        formAttributes: getFormAttributes(state),
      };
    },
    {
      fetchPlotSearchAttributes,
      fetchPlotSearchSubtypes,
      fetchFormAttributes,
    },
  ),
  PlotSearchAttributes,
);

export {withPlotSearchAttributes};
