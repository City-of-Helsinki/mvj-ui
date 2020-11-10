// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {
  fetchAttributes as fetchPlotSearchAttributes,
  fetchPlotSearchSubtypes,
  fetchApplicationAttributes,
} from '$src/plotSearch/actions';
import {
  getAttributes as getPlotSearchAttributes,
  getIsFetchingAttributes as getIsFetchingPlotSearchAttributes,
  getPlotSearchMethods,
  getPlotSearchSubTypes,
  getIsFetching,
  getIsFetchingApplicationAttributes,
  getApplicationAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes, Methods} from '$src/types';

function PlotSearchAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotSearchAttributes: Function,
    fetchPlotSearchSubtypes: Function,
    fetchApplicationAttributes: Function,
    isFetchingPlotSearchAttributes: boolean,
    isFetching: boolean,
    applicationAttributes: Attributes,
    isFetchingApplicationAttribute: boolean,
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
        isFetchingApplicationAttribute,
        applicationAttributes,
        fetchApplicationAttributes,
      } = this.props;

      if(!isFetchingPlotSearchAttributes && !plotSearchAttributes) {
        fetchPlotSearchAttributes();
      }
      if(!isFetching && !plotSearchSubTypes) {
        fetchPlotSearchSubtypes();
      }
      if(!isFetchingApplicationAttribute && !applicationAttributes) {
        fetchApplicationAttributes();
        console.log('asdf');
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
        isFetchingApplicationAttribute: getIsFetchingApplicationAttributes(state),
        applicationAttributes: getApplicationAttributes(state),
      };
    },
    {
      fetchPlotSearchAttributes,
      fetchPlotSearchSubtypes,
      fetchApplicationAttributes,
    },
  ),
  PlotSearchAttributes,
);

export {withPlotSearchAttributes};
